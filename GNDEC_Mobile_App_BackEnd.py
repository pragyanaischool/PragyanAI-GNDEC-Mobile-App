import os
import gdown
import pandas as pd
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# LangChain components
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq

# --- Load Environment Variables ---
# This allows you to use a .env file for local development
load_dotenv()

# --- Application Setup ---
app = FastAPI(
    title="PragyanAI Backend",
    description="API for the PragyanAI GNDEC mobile app to handle AI tasks.",
    version="1.0.0"
)

# --- CORS Configuration ---
# This allows the frontend (running on a different domain) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- RAG Pipeline Setup ---

# We use a simple global state dictionary to hold our loaded QA chain
# This prevents reloading the model and data on every request.
state = {"qa_chain": None}

def setup_rag_pipeline():
    """
    Downloads PDF, loads it, creates embeddings, and sets up a RAG QA chain.
    This function is called once on application startup.
    """
    print("Setting up RAG pipeline...")
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("ERROR: GROQ_API_KEY environment variable not found.")
        return None

    # 1. Download PDF from Google Drive
    output_pdf_path = "PragyanAI_3Year_MCP_Program_Brochure_GNDEC.pdf"
    file_id = "1qHv77BYbi24hdUXyt63nPmJJs8hxw7VL"
    
    if not os.path.exists(output_pdf_path):
        print(f"Downloading brochure (ID: {file_id}) to {output_pdf_path}...")
        gdown.download(id=file_id, output=output_pdf_path, quiet=False)
        print("Download complete.")
    else:
        print(f"Brochure already exists at {output_pdf_path}.")

    # 2. Load and Process PDF
    print("Loading and processing PDF...")
    loader = PyPDFLoader(file_path=output_pdf_path)
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    # 3. Create Embeddings and Vector Store
    print("Creating embeddings and vector store...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)

    # 4. Setup LLM & Retrieval QA Chain
    print("Setting up LLM and QA chain...")
    llm = ChatGroq(api_key=groq_api_key, model_name="llama-3.1-70b-versatile")
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )
    print("RAG pipeline setup complete!")
    return qa_chain

@app.on_event("startup")
def on_startup():
    """Event handler for application startup."""
    state["qa_chain"] = setup_rag_pipeline()
    if state["qa_chain"] is None:
        print("CRITICAL: QA chain failed to initialize. The /ask endpoint will not work.")

# --- API Endpoints ---

class AskRequest(BaseModel):
    query: str

class AskResponse(BaseModel):
    answer: str

@app.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest):
    """
    Endpoint to ask a question to the RAG-based AI assistant.
    """
    if state["qa_chain"] is None:
        return {"answer": "Sorry, the AI Assistant is not available right now due to a configuration error."}
    
    try:
        print(f"Received query: {request.query}")
        response = state["qa_chain"].invoke({"query": request.query})
        answer = response.get("result", "Sorry, I couldn't find an answer in the document.")
        print(f"Generated answer: {answer}")
        return {"answer": answer}
    except Exception as e:
        print(f"Error during QA chain invocation: {e}")
        return {"answer": "An error occurred while processing your question."}

class AnalyzeResponse(BaseModel):
    analysis: str

@app.get("/analyze", response_model=AnalyzeResponse)
def analyze_data():
    """
    Endpoint to generate AI-powered insights for the analytics dashboard.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        return {"analysis": "AI analysis is unavailable due to a missing API key."}

    # Generate dummy data for the prompt
    visitors = np.random.randint(150, 400, size=30)
    total_visitors = int(np.sum(visitors))
    form_fills = (visitors * np.random.uniform(0.05, 0.15, size=30)).astype(int)
    total_forms = int(np.sum(form_fills))
    conversion_rate = (total_forms / total_visitors) * 100 if total_visitors > 0 else 0

    prompt = f"""
    Analyze the following simulated user engagement data for a course landing page over the last 30 days and provide a summary of insights.

    Data Summary:
    - Total Page Visits: {total_visitors}
    - Total Interest Forms Filled: {total_forms}
    - Overall Conversion Rate (Visits to Form Fills): {conversion_rate:.2f}%

    Based on this data, provide a brief, easy-to-understand analysis covering these points in markdown format:
    1.  **Overall Performance:** Give a general assessment of the engagement.
    2.  **Key Trends:** Identify any notable trends (e.g., is the conversion rate healthy?).
    3.  **Actionable Suggestions:** Suggest one or two potential actions to improve engagement or conversions.
    """

    try:
        print("Generating AI analysis for dashboard...")
        llm = ChatGroq(api_key=groq_api_key, model_name="llama-3.1-70b-versatile")
        response = llm.invoke(prompt)
        analysis_text = response.content
        print("Analysis generated successfully.")
        return {"analysis": analysis_text}
    except Exception as e:
        print(f"Error during AI analysis generation: {e}")
        return {"analysis": f"An error occurred while generating insights: {e}"}

@app.get("/")
def read_root():
    return {"status": "PragyanAI Backend is running"}
