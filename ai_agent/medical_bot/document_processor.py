import datetime
from langchain_community.document_loaders import TextLoader, PyPDFLoader
import config
from database import add_personal_document_to_db

def _extract_info_with_llm(text_content):
    """Uses LLM to summarize and extract key medical findings from raw text."""
    from langchain_core.prompts import ChatPromptTemplate
    
    llm = config.get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a medical data extraction assistant. Extract the patient's key medical findings, diagnoses, test results, and recommendations from the following text. Format it as a concise summary. If no medical info is found, just say 'No significant clinical findings'."),
        ("user", "{text}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({"text": text_content[:4000]}) 
    return response.content

def process_uploaded_file(file_path):
    """Reads an uploaded report, extracts info, appends to personal data, and adds directly to DB."""
    try:
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
            docs = loader.load()
        else:
            loader = TextLoader(file_path)
            docs = loader.load()
            
        full_text = " ".join([d.page_content for d in docs])
        
        
        extracted_findings = _extract_info_with_llm(full_text)
        
        
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        record = f"\n\n--- Report Uploaded on {timestamp} ---\n{extracted_findings}\n"
        
        with open(config.PERSONAL_DATA_FILE, "a") as f:
            f.write(record)
            
        
        metadata = {"source": "uploaded_report", "timestamp": timestamp}
        add_personal_document_to_db(record, metadata)
        
        return True, extracted_findings
        
    except Exception as e:
        return False, str(e)
