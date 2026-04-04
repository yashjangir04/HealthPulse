import os
import time
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_cors import CORS  # Imported CORS here
import sys

try:
    from database import init_knowledge_base, add_personal_document_to_db
    from agent import query_agent
    import config
except Exception as e:
    print(f"\nError loading dependencies: {e}")
    print("If you see a DLL initialized failed error (like c10.dll), it is a known PyTorch issue on Windows. You may need to reinstall torch or update your environment.")
    sys.exit(1)

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key-healthpulse")

# Enable CORS for the application
# Replace your simple CORS(app) with this robust version:
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

print("Initializing Knowledge Base (this may take a few moments)...")
# Initialize the medical knowledge base and personal DB vector store
init_knowledge_base()
print("Knowledge base loaded successfully!")

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json()
    question = data.get("question")
    english_question = data.get("english_question", question)
    if not question:
        return jsonify({"error": "No question provided"}), 400
        
    try:
        response = query_agent(question, english_question)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error during query_agent: {e}")
        return jsonify({"error": "Failed to process question."}), 500

@app.route("/api/personal", methods=["POST"])
def personal():
    data = request.get_json()
    content = data.get("personal_info")

    if not content or not content.strip():
        return jsonify({"error": "No content provided"}), 400

    try:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

        # 1. Add to vector DB
        print("Adding to vector store...")
        add_personal_document_to_db(
            content,
            {"source": "api_input", "timestamp": timestamp}
        )

        # 2. Persist to file
        try:
            print("Logging to file...")
            with open(config.PERSONAL_DATA_FILE, "a", encoding="utf-8") as f:
                record = f"\n\n--- Added via API on {timestamp} ---\n{content}\n"
                f.write(record)
        except Exception as e:
            print(f"File logging error: {e}")

        return jsonify({
            "message": "Personal data stored successfully",
            "timestamp": timestamp
        }), 200

    except Exception as e:
        print(f"Error in /personal: {e}")
        return jsonify({"error": "Failed to store data"}), 500

@app.route("/api/reset-db", methods=["POST"])
def reset_db():
    try:
        from database import reset_personal_db

        reset_personal_db()

        return jsonify({
            "message": "Database cleared successfully"
        }), 200

    except Exception as e:
        print(f"Error resetting DB: {e}")
        return jsonify({"error": "Failed to reset DB"}), 500
    
if __name__ == "__main__":
    app.run(debug=True, port=5500)