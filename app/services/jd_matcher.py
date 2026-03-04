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

def semantic_match(resume_text: str, jd_text:str) -> dict:
    resume_vector = get_embedding(resume_text)
    jd_vector = get_embedding(jd_text)

    similarity_score = cosine_similarity(resume_vector, jd_vector)

    match_percentage = int(similarity_score * 100)

    return {
        "semantic_match_percentage": match_percentage,
        "similarity_score_raw": similarity_score
    }