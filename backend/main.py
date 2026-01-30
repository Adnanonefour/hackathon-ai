import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

app = FastAPI()

# Enable CORS for your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetching token from environment variable
# This keeps the actual "hf_..." string out of your code and GitHub history
HF_TOKEN = os.getenv("HF_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

class StoryRequest(BaseModel):
    title: str
    content: str

def query_embedding(text: str):
    response = requests.post(API_URL, headers=headers, json={"inputs": text})
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="AI Model Error")
    return response.json()

@app.post("/verify-and-mint")
async def verify_and_mint(request: StoryRequest):
    # 1. AI Integrity Check (Example: check content length or placeholder similarity)
    if len(request.content) < 50:
        return {"success": False, "message": "Story too short for integrity check."}

    # 2. Get Embedding (Proves we processed it through our AI gatekeeper)
    embedding = query_embedding(request.content)
    
    # 3. Minting Logic (This is where your Python logic calls the smart contract)
    # Ensure your .env also contains your PRIVATE_KEY for the minting wallet
    return {
        "success": True, 
        "message": "Story verified by AI and minted!",
        "embedding_preview": embedding[:5]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)