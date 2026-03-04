from fastapi import APIRouter
from pydantic import BaseModel
from app.services.jd_matcher import semantic_match

router = APIRouter(prefix='/jd', tags=['job description'])

class JDRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/semantic-match")
def semantic_match_endpoint(request: JDRequest):
    result = semantic_match(
        request.resume_text,
        request.job_description
        )
    return {
        "semantic_result": result,
        "message": "semantic matching completed"
    }

