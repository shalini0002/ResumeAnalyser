# import re
# def extract_skills_from_jd(jd_text: str) -> list:
#     #simple skill extraction using regex(expand later)
#     common_skills = [
#         "react", "javascript", "typescript", "node",
#         "docker", "aws", "graphql", "sql",
#         "mongodb", "next.js", "fastapi", "python",
#         "django", "flask", "java", "spring"
#     ]
#     jd_text_lower = jd_text.lower()
    
#     return [skill for skill in common_skills if skill in jd_text_lower]

# def calculate_match(resume_data:dict, jd_text:str) -> dict: 
#     resume_skills = [skill.lower() for skill in resume_data.get("skills", [])]
#     jd_skills = extract_skills_from_jd(jd_text)
    
#     matched = list(set(resume_skills)&(set(jd_skills)))
#     missing = list(set(jd_skills)-(set(resume_skills)))

#     if len(jd_skills) == 0:
#         match_percentage = 0
#     else:
#         match_percentage = int((len(matched) / len(jd_skills))*100)  
    
#     return {"matched": matched, "missing": missing, "match_percentage": match_percentage}
    

from app.services.embedding_service import get_embedding, cosine_similarity
from app.services.ats_scorer import ats_score
import re

def extract_skills(text: str):
    skills_db = [
        "react", "javascript", "typescript", "node",
        "docker", "aws", "graphql", "sql",
        "mongodb", "next.js", "fastapi", "python"
    ]

    text_lower = text.lower()
    return [skill for skill in skills_db if skill in text_lower]


def hybrid_match_engine(resume_text: str, jd_text: str) -> dict:
    # --- Semantic Score ---
    resume_vector = get_embedding(resume_text)
    jd_vector = get_embedding(jd_text)
    semantic_score = cosine_similarity(resume_vector, jd_vector)

    semantic_percentage = int(semantic_score * 100)

    # --- Skill Score ---
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    matched = list(set(resume_skills) & set(jd_skills))
    missing = list(set(jd_skills) - set(resume_skills))

    if len(jd_skills) == 0:
        skill_score = 0
    else:
        skill_score = int((len(matched) / len(jd_skills)) * 100)

    # --- ATS Score ---
    ats_result = ats_score(resume_text)
    ats_value = ats_result["ats_score"]

    # --- Final Weighted Score ---
    overall_score = int(
        (0.5 * semantic_percentage) +
        (0.3 * skill_score) +
        (0.2 * ats_value)
    )

    return {
        "overall_match_score": overall_score,
        "semantic_score": semantic_percentage,
        "skill_score": skill_score,
        "ats_score": ats_value,
        "matched_skills": matched,
        "missing_skills": missing,
        "ats_issues": ats_result["ats_issues"]
    }