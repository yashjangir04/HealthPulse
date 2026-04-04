from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import config
from database import get_medical_vector_store, get_personal_vector_store

def query_agent(question, english_question=None):
    """Queries the RAG system based on knowledge base and personal file."""
    llm = config.get_llm()
    
    if not english_question:
        english_question = question
        
    medical_store = get_medical_vector_store()
    personal_store = get_personal_vector_store()
    
    docs_medical = medical_store.similarity_search(english_question, k=6)
    docs_personal = personal_store.similarity_search(english_question, k=4)
    
    context_str = "=== GENERAL MEDICAL KNOWLEDGE ===\n"
    context_str += "\n\n".join([doc.page_content for doc in docs_medical])
    context_str += "\n\n=== PATIENT'S PERSONAL MEDICAL RECORDS ===\n"
    context_str += "\n\n".join([doc.page_content for doc in docs_personal])
    
    system_prompt = (
        "You are an expert Medical AI Assistant. You are provided with two sets of context: General Medical Knowledge and the user's Personal Medical Records.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "0. READ AND REPLY IN THE EXACT SAME LANGUAGE AS THE USER'S QUESTION. This is absolute priority. If they ask in Hindi, reply in Hindi. If Tamil, reply in Tamil.\n"
        "1. The user speaking to you IS the patient described in the Personal Medical Records. When they say 'I' or 'my', they are referring to the data in those records. Respond directly to them using 'you' and 'your' (e.g., 'Your A1C is 7.4%...').\n"
        "2. Answer the user's question by combining facts from the General Medical Knowledge with their Personal Medical Records.\n"
        "3. If the user asks about a medical term, test, or symptom (like A1C or bellyache), STRICTLY find and use the definition/guidelines from the General Medical Knowledge section. DO NOT use outside knowledge or hallucinate guidelines (e.g., if the text says 'twice a year', say exactly that. Do not invent ADA guidelines, etc.).\n"
        "4. ALWAYS cross-reference the user's stats (like their actual A1C, age, or medications) against the General Medical Knowledge to provide safe, personalized insights.\n"
        "5. DO NOT claim you don't have the user's medical history if it is visible in the Personal Medical Records section.\n"
        "6. If the answer is not contained in the provided context, state that clearly and do not make up fake medical information.\n"
        "7. DO NOT offer to schedule appointments, prescribe medications, or act like a clinic receptionist. You are an informational AI, not a doctor's office.\n\n"
        "CONTEXT:\n{context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    chain = prompt | llm | StrOutputParser()
    
    try:
        response = chain.invoke({"context": context_str, "input": question})
        return response
    except Exception as e:
        if "AuthenticationError" in str(e) or "api_key" in str(e).lower():
            return "Configuration Error: Please make sure you have added a valid GROQ_API_KEY in the `.env` file."
        return f"Error evaluating query: {str(e)}"