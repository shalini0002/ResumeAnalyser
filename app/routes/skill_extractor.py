from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

class SkillGapRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/resume/skill-gap")
async def skill_gap(request: SkillGapRequest):

    prompt = f"""
Extract skills from the resume and job description.

Return:
1. resume_skills
2. job_required_skills
3. matched_skills
4. missing_skills

Resume:
{request.resume_text}

Job Description:
{request.job_description}

Return JSON.
"""

    response = model.generate_content(prompt)

    return {
        "skill_analysis": response.text
    }