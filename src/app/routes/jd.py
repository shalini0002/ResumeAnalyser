from fastapi import APIRouter
from pydantic import BaseModel
# from app.services.jd_matcher import semantic_match
from app.services.jd_matcher import hybrid_match_engine, extract_skills

router = APIRouter(prefix='/jd', tags=['job description'])

class JDRequest(BaseModel):
    resume_text: str
    job_description: str

# @router.post("/match")
# def match_resume_with_jd(request: JDRequest):
#     return {
#         "message": "Matching endpoint ready",
#         "resume_received": request.resume_data.get("full_name"),
#     }

@router.post("/analyze")
def analyze_resume(request: JDRequest):
    # Extract skills and calculate basic match score
    resume_skills = extract_skills(request.resume_text)
    job_skills = extract_skills(request.job_description)
    matched_skills = list(set(resume_skills) & set(job_skills))
    
    match_score = int((len(matched_skills) / len(job_skills)) * 100) if len(job_skills) > 0 else 0
    
    result = hybrid_match_engine(
        request.resume_text,
        request.job_description
        )
    return {
        "ats_score": match_score,
        "semantic_result": result,
        "message": "Hybrid Resume Analysis Completed"
    }

