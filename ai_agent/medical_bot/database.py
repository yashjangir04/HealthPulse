import os
import json
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

import config

def get_medical_vector_store():
    """Get or create the medical knowledge vector database instance."""
    return Chroma(
        persist_directory=config.CHROMA_PATH_MEDICAL, 
        embedding_function=config.get_embeddings()
    )

def get_personal_vector_store():
    """Get or create the personal data vector database instance."""
    return Chroma(
        persist_directory=config.CHROMA_PATH_PERSONAL, 
        embedding_function=config.get_embeddings()
    )

def init_knowledge_base():
    """Initializes the medical and personal vector stores."""
    
    medical_store = get_medical_vector_store()
    
    if len(medical_store.get()['ids']) == 0:
        print("Initializing Medical Database")
        docs_medical = []
        if os.path.exists(config.MEDICAL_KNOWLEDGE_FILE):
            try:
                with open(config.MEDICAL_KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.strip():
                            data = json.loads(line)
                            title = data.get("title", "Unknown")
                            content = data.get("content", "")
                            source = data.get("source", "Unknown")
                            full_text = f"Title: {title}\n{content}\nSource: {source}"
                            docs_medical.append(Document(page_content=full_text, metadata={"source": "medical_knowledge", "title": title}))
            except Exception as e:
                print(f"Error loading {config.MEDICAL_KNOWLEDGE_FILE}: {e}")
        else:
            docs_medical.append(Document(page_content="Basic medical knowledge base initialized.", metadata={"source": "fallback"}))
        
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs_medical)
        
        if splits:
            medical_store.add_documents(documents=splits)

    
    personal_store = get_personal_vector_store()
    if len(personal_store.get()['ids']) == 0:
        print("Initializing Personal Database")
        if not os.path.exists(config.PERSONAL_DATA_FILE):
            with open(config.PERSONAL_DATA_FILE, "w", encoding="utf-8") as f:
                f.write("User Personal Data initialized.\n")
        
        docs_personal = []
        try:
            loader = TextLoader(config.PERSONAL_DATA_FILE, encoding="utf-8")
            docs_personal.extend(loader.load())
        except Exception as e:
            print(f"Error loading {config.PERSONAL_DATA_FILE}: {e}")
                
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs_personal)
        
        if splits:
            personal_store.add_documents(documents=splits)


def add_personal_document_to_db(doc_content, metadata):
    """Adds a single document string incrementaly to the personal DB."""
    vectorstore = get_personal_vector_store()
    doc = Document(page_content=doc_content, metadata=metadata)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents([doc])
    vectorstore.add_documents(documents=splits)

def reset_personal_data():
    """Clears the personal data file and resets the personal database."""
    
    with open(config.PERSONAL_DATA_FILE, "w", encoding="utf-8") as f:
        f.write("User Personal Data initialized.\n")
        
   
    vectorstore = get_personal_vector_store()
    try:
        vectorstore.delete_collection()
    except Exception as e:
        pass 
        
   
    init_knowledge_base()
    return True
