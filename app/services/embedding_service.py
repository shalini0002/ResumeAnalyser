import os
import google.generativeai as genai 
import numpy as np 
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_embedding(text: str):
    response = genai.embed_content(
        model="models/gemini-embedding-001",
        content = text
    )
    return response["embedding"]

def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)

    return float(np.dot(vec1, vec2)/(np.linalg.norm(vec1) * np.linalg.norm(vec2)))