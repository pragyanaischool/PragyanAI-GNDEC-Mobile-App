import os
import gdown
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.concurrency import run_in_threadpool

# LangChain components
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq

# --- Basic Configuration ---
load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Environment Variables & Constants ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PDF_FILE_ID = os.getenv("PDF_FILE_ID", "1qHv77BYbi24hdUXyt63nPmJJs8hxw7VL")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "llama-3.1-70b-versatile")
PDF_OUTPUT_PATH = "data/PragyanAI_3Year_MCP_Program_Brochure_GNDEC.pdf"
FAISS_INDEX_PATH = "faiss_index"

# --- Application Setup ---
app = FastAPI(
    title="PragyanAI Backend (Enhanced)",
    description="An enhanced API for the PragyanAI GNDEC mobile app with improved logging, caching, and async support.",
    version="1.1.0"
)

# --- CORS Configuration ---
# In production, you should restrict this to your frontend's domain for security.
# For example: allow_origins=["https://your-frontend-app-name.onrender.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global State ---
# This dictionary holds our loaded QA chain to avoid reloading on every request.
state = {"qa_chain": None, "rag_status": "uninitialized"}

# --- RAG Pipeline Setup ---
def setup_rag_pipeline():
    """
    Initializes the entire RAG pipeline. It handles PDF download, document
    processing, and loading/creating a FAISS vector store.
    """
    state["rag_status"] = "initializing"
    logging.info("Starting RAG pipeline setup...")

    if not GROQ_API_KEY:
        logging.error("GROQ_API_KEY environment variable not found. RAG setup failed.")
        state["rag_status"] = "error_missing_api_key"
        return None

    try:
        # Ensure data directory exists
        os.makedirs(os.path.dirname(PDF_OUTPUT_PATH), exist_ok=True)
        
        # 1. Download PDF if it doesn't exist
        if not os.path.exists(PDF_OUTPUT_PATH):
            logging.info(f"Downloading brochure (ID: {PDF_FILE_ID}) to {PDF_OUTPUT_PATH}...")
            gdown.download(id=PDF_FILE_ID, output=PDF_OUTPUT_PATH, quiet=False)
            logging.info("Download complete.")
        else:
            logging.info(f"Brochure already exists at {PDF_OUTPUT_PATH}.")

        # 2. Create Embeddings
        logging.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

        # 3. Load or Create Vector Store
        if os.path.exists(FAISS_INDEX_PATH):
            logging.info(f"Loading existing FAISS index from {FAISS_INDEX_PATH}...")
            # allow_dangerous_deserialization is required for loading FAISS indexes from untrusted sources.
            # Since we are creating the index ourselves, this is safe.
            vectorstore = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
            logging.info("FAISS index loaded successfully.")
        else:
            logging.info("No FAISS index found. Creating a new one.")
            logging.info("Loading and processing PDF for indexing...")
            loader = PyPDFLoader(file_path=PDF_OUTPUT_PATH)
            docs = loader.load()
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            splits = text_splitter.split_documents(docs)
            
            logging.info("Creating vector store from document splits...")
            vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)
            
            logging.info(f"Saving new FAISS index to {FAISS_INDEX_PATH}...")
            vectorstore.save_local(FAISS_INDEX_PATH)
            logging.info("FAISS index created and saved.")

        # 4. Setup LLM & Retrieval QA Chain
        logging.info(f"Setting up LLM ({LLM_MODEL_NAME}) and QA chain...")
        llm = ChatGroq(api_key=GROQ_API_KEY, model_name=LLM_MODEL_NAME)
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever()
        )
        
        logging.info("RAG pipeline setup complete!")
        state["rag_status"] = "ready"
        return qa_chain

    except Exception as e:
        logging.error(f"An error occurred during RAG pipeline setup: {e}", exc_info=True)
        state["rag_status"] = "error_setup_failed"
        return None

@app.on_event("startup")
def on_startup():
    """Event handler for application startup. Initializes the RAG pipeline."""
    state["qa_chain"] = setup_rag_pipeline()

# --- API Models ---
class AskRequest(BaseModel):
    query: str

class AskResponse(BaseModel):
    answer: str

class AnalyzeResponse(BaseModel):
    analysis: str

class StatusResponse(BaseModel):
    status: str
    rag_status: str
    version: str

# --- API Endpoints ---
@app.get("/", response_model=StatusResponse, tags=["General"])
async def read_root():
    """Provides the current status of the API and the RAG pipeline."""
    return {
        "status": "online",
        "rag_status": state.get("rag_status", "unknown"),
        "version": app.version
    }

@app.post("/ask", response_model=AskResponse, tags=["AI Assistant"])
async def ask_question(request: AskRequest):
    """
    Asynchronously handles a question to the RAG-based AI assistant.
    Uses a thread pool to run the blocking LangChain call.
    """
    if state["rag_status"] != "ready" or state["qa_chain"] is None:
        raise HTTPException(
            status_code=503, 
            detail=f"The AI Assistant is not available. Status: {state['rag_status']}"
        )
    
    try:
        logging.info(f"Received query: {request.query}")
        
        # Run the blocking I/O call in a separate thread to not block the event loop
        response = await run_in_threadpool(state["qa_chain"].invoke, {"query": request.query})
        
        answer = response.get("result", "Sorry, I couldn't find an answer in the document.")
        logging.info(f"Generated answer snippet: {answer[:80]}...")
        return {"answer": answer}
    except Exception as e:
        logging.error(f"Error during QA chain invocation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while processing your question.")

@app.get("/analyze", response_model=AnalyzeResponse, tags=["Dashboard"])
async def analyze_data():
    """
    Asynchronously generates AI-powered insights for the analytics dashboard.
    """
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="AI analysis is unavailable due to a missing API key.")

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
        logging.info("Generating AI analysis for dashboard...")
        llm = ChatGroq(api_key=GROQ_API_KEY, model_name=LLM_MODEL_NAME)
        
        # Run the blocking I/O call in a separate thread
        response = await run_in_threadpool(llm.invoke, prompt)
        
        analysis_text = response.content
        logging.info("Analysis generated successfully.")
        return {"analysis": analysis_text}
    except Exception as e:
        logging.error(f"Error during AI analysis generation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while generating insights.")
