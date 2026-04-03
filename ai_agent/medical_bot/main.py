import sys
import time
import os

print("Loading Medical Assistant")

try:
    from database import init_knowledge_base, add_personal_document_to_db
    from agent import query_agent
    import config
except Exception as e:
    print(f"\nError loading dependencies: {e}")
    sys.exit(1)

def main():
    print("Initializing Knowledge Base")
    init_knowledge_base()
    
    print("\n" + "-"*60)
    print("      Welcome to the Terminal Medical AI Assistant!      ")
    print("-"*60)
    
    print("Give your information below or type DONE or SKIP ")
    
    personal_lines = []
    while True:
        try:
            line = input("> ").strip()
            if line.upper() == 'SKIP':
                break
            elif line.upper() == 'DONE':
                if personal_lines:
                    content = "\n".join(personal_lines)
                    print("\nProcessing and adding to your personal database...")
                    
                    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
                    
                    
                    add_personal_document_to_db(content, {"source": "terminal_input", "timestamp": timestamp})
                    
                    with open(config.PERSONAL_DATA_FILE, "a", encoding="utf-8") as f:
                        record = f"\n\n--- Added via Terminal on {timestamp} ---\n{content}\n"
                        f.write(record)
                    
                    print("Personal records added")
                break
            else:
                if line:
                    personal_lines.append(line)
        except KeyboardInterrupt:
            print("\nNo personal data enter")
            break
            
    print("\n" + "-"*60)
    print("Chatbot is ready")
    print("Type 'QUIT' or 'EXIT' to stop")
    print("-" * 60)
    
    while True:
        try:
            question = input("\nUser: ").strip()
            if not question:
                continue
            if question.upper() in ['QUIT', 'EXIT']:
                print("\nGoodbye! Stay healthy!")
                break
                
            print("Assistant: Thinking...")
            
            response = query_agent(question)
            
            print(f"\nAssistant:\n{response}")
            
        except KeyboardInterrupt:
            print("\nGoodbye! Stay healthy!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    main()