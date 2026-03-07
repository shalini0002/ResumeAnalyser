from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.5-flash")

class ResumeImprovementRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/resume/improve")
async def improve_resume(request: ResumeImprovementRequest):

    prompt = f"""
You are an ATS and career expert.

Analyze the resume and job description.

Return:
1. Missing keywords
2. Resume improvement suggestions
3. How the candidate can modify resume bullets

Resume:
{request.resume_text}

Job Description:
{request.job_description}

Return response in JSON format.
"""

    response = model.generate_content(prompt)
    return{
        "ai_suggestions": response.text
    }