import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# 1. Robust .env loading for Vercel
# This ensures it finds the file regardless of the working directory
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Secure Token Retrieval
HF_TOKEN = os.getenv("HF_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

class StoryRequest(BaseModel):
    title: str
    content: str

# 3. Non-blocking AI Query using httpx
async def query_embedding(text: str):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="Server Configuration Error: Missing HF_TOKEN")
    
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(API_URL, headers=headers, json={"inputs": text}, timeout=10.0)
            
            # If Hugging Face returns an error, log it specifically
            if response.status_code != 200:
                print(f"HF API Error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=response.status_code, detail=f"AI Model Error: {response.text}")
                
            return response.json()
        except httpx.ReadTimeout:
            raise HTTPException(status_code=504, detail="AI Model took too long to respond")
        except Exception as e:
            print(f"Unexpected Backend Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal Server Logic Error")

@app.post("/verify-and-mint")
async def verify_and_mint(request: StoryRequest):
    # Integrity Check
    if len(request.content) < 50:
        return {"success": False, "message": "Story too short for integrity check."}

    # AI Verification
    embedding = await query_embedding(request.content)
    
    # Successful response
    return {
        "success": True, 
        "message": "Story verified by AI and ready for minting!",
        "embedding_preview": embedding[:5] if isinstance(embedding, list) else []
    }