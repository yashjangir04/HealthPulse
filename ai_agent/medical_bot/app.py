import os
import time
from flask import Flask, render_template, request, jsonify, redirect, url_for
import sys

try:
    from database import init_knowledge_base, add_personal_document_to_db
    from agent import query_agent
    import config
except Exception as e:
    print(f"\nError loading dependencies: {e}")
    sys.exit(1)

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key-healthpulse")

print("Initializing Knowledge Base (this may take a few moments)...")

init_knowledge_base()
print("Knowledge base loaded")

@app.route("/")
def index():
    return render_template("chat.html")

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json()
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400
        
    try:
        response = query_agent(question)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error during query_agent: {e}")
        return jsonify({"error": "Failed to process question."}), 500

@app.route("/personal", methods=["GET", "POST"])
def personal():
    if request.method == "POST":
        content = request.form.get("personal_info")
        if content and content.strip():
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            
            print("Adding to vector store...")
            add_personal_document_to_db(content, {"source": "web_input", "timestamp": timestamp})
            
            try:
                print("Logging to personal data")
                with open(config.PERSONAL_DATA_FILE, "a", encoding="utf-8") as f:
                    record = f"\n\nAdded via HealthPulse Web on {timestamp} \n{content}\n"
                    f.write(record)
            except Exception as e:
                print(f"Error appending to file: {e}")
                
            return render_template("personal.html", success=True)
    return render_template("personal.html")

if __name__ == "__main__":
    app.run(debug=True, port=5500)
