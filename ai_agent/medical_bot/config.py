import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq

load_dotenv()

CHROMA_PATH_MEDICAL = "chroma_db_medical"
CHROMA_PATH_PERSONAL = "chroma_db_personal"
PERSONAL_DATA_FILE = "personal_data.txt"
MEDICAL_KNOWLEDGE_FILE = "medline_full_database.jsonl"


EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
LLM_MODEL_NAME = "llama-3.1-8b-instant"

def get_embeddings():
    """Returns the configured embeddings model."""
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

def get_llm():
    """Returns the configured Groq LLM instance."""
    return ChatGroq(
        model=LLM_MODEL_NAME,
        temperature=0.2,
        api_key=os.getenv("GROQ_API_KEY")
    )
