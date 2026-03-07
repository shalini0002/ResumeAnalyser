from fastapi import APIRouter
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

@router.post("/resume/rewrite-bullet")
async def bullet_rewrite(bullet: str):

    prompt = f"""
You are a resume expert.

Rewrite the following resume bullet to be:
- professional
- achievement focused
- ATS friendly
- quantified with impact if possible

Original bullet:
{bullet}

Return only the improved bullet.
"""
    response = model.generate_content(prompt)
    
    return {
        "original_bullet": bullet,
        "improved_bullet": response.text
    }
  
