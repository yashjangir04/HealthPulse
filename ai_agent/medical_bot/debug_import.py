try:
    from database import init_knowledge_base, add_personal_document_to_db
    from agent import query_agent
    import config
    print("SUCCESS")
except Exception as e:
    import traceback
    with open("error.log", "w") as f:
        traceback.print_exc(file=f)
    print("FAILED")
