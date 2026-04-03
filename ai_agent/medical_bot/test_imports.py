import sys
import traceback

tests = [
    ("dotenv", "from dotenv import load_dotenv"),
    ("langchain_huggingface", "from langchain_huggingface import HuggingFaceEmbeddings"),
    ("langchain_groq", "from langchain_groq import ChatGroq"),
    ("langchain_chroma", "from langchain_chroma import Chroma"),
    ("langchain_text_splitters", "from langchain_text_splitters import RecursiveCharacterTextSplitter"),
    ("chromadb", "import chromadb"),
    ("config module", "import config"),
    ("database module", "from database import init_knowledge_base, add_personal_document_to_db"),
    ("agent module", "from agent import query_agent"),
]

for name, stmt in tests:
    try:
        exec(stmt)
        print(f"OK: {name}")
    except Exception as e:
        print(f"FAIL: {name}")
        traceback.print_exc()
        print()
