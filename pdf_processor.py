# pdf_processor.py
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import os
from datetime import datetime

# Initialize embedding model
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = None  # Global FAISS index

# Define the upload directory
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)  # Ensure the folder exists

def process_pdfs(files):
    """Load PDFs, process them, and create a FAISS index."""
    global db
    documents = []

def process_pdfs(files):
    """Process uploaded PDFs, store them in the 'uploads/' folder, and create a FAISS index."""
    global db
    documents = []

    for file in files:
        if file.filename.endswith('.pdf'):
            # Generate a unique filename with a timestamp to avoid conflicts
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"{timestamp}_{file.filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Load PDF content
            loader = PyPDFLoader(filepath)
            documents.extend(loader.load())

    # Create FAISS index from documents
    db = FAISS.from_documents(documents, embedding_model)
    print("123")
    return "PDF processed successfully"

def query_pdf(query):
    """Query the FAISS index and return the best-matched content."""
    if db is None:
        return {"error": "No PDF files have been processed yet. Please upload a PDF first."}
    
    docs = db.similarity_search(query)
    if docs:
        return {"answer": docs[0].page_content}  # Return the best match
    else:
        return {"answer": "No relevant information found."}