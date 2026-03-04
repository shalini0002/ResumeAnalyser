import re

def ats_score(resume_text: str) -> dict:
    score= 100
    issues = []

    #check contact info
    if not re.search(r'\b\d{10}\b', resume_text):
        issues.append("Missing contact number")
        score -= 10

    if "@" not in resume_text:
        issues.append("Missing email")
        score -= 10

    #check length
    word_count = len(resume_text.split())
    if word_count < 500:
        issues.append("Resume too short")
        score -= 10

    #check section
    important_sections = ["experience", "education", "skills"]
    for section in important_sections:
        if section not in resume_text.lower():
            issues.append(f"Missing {section}")
            score -= 5

    if score < 0:
        score = 0
    return {"ats_score": score,
     "ats_issues": issues}