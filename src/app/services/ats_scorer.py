import re

def extract_skills(text: str) -> list:
    """Extract skills from resume text"""
    skills_db = [
        "react", "javascript", "typescript", "node", "node.js", "nodejs",
        "docker", "aws", "azure", "gcp", "graphql", "sql", "nosql",
        "mongodb", "postgresql", "mysql", "firebase", "next.js", "nextjs",
        "fastapi", "python", "django", "flask", "java", "spring", "spring boot",
        "c++", "c#", ".net", "php", "ruby", "rails", "go", "rust",
        "kotlin", "swift", "objective-c", "scala", "perl", "r", "matlab",
        "html", "css", "sass", "scss", "bootstrap", "tailwind", "jquery",
        "angular", "vue", "vue.js", "vuejs", "svelte", "ember", "backbone",
        "express", "koa", "nest", "nestjs", "hapi", "loopback",
        "redis", "elasticsearch", "kafka", "rabbitmq", "nginx", "apache",
        "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack",
        "ci/cd", "jenkins", "travis", "circleci", "github actions", "gitlab ci",
        "kubernetes", "k8s", "helm", "terraform", "ansible", "puppet", "chef",
        "microservices", "rest", "restful", "soap", "graphql", "grpc", "websockets",
        "agile", "scrum", "kanban", "waterfall", "devops", "tdd", "bdd", "unit testing",
        "machine learning", "ml", "deep learning", "ai", "data science", "analytics",
        "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "jupyter",
        "tableau", "power bi", "excel", "sap", "salesforce", "hubspot", "marketo",
        "seo", "sem", "ppc", "social media", "content marketing", "email marketing"
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in skills_db:
        # Check for exact skill matches
        if skill in text_lower:
            found_skills.append(skill)
        # Also check for variations
        elif skill.replace('.', '') in text_lower.replace('.', ''):
            found_skills.append(skill)
        elif skill.replace('-', '') in text_lower.replace('-', ' '):
            found_skills.append(skill)
    
    return list(set(found_skills))  # Remove duplicates

def ats_score(resume_text: str) -> dict:
    score = 100
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

    # Extract skills from resume
    extracted_skills = extract_skills(resume_text)
    
    if score < 0:
        score = 0
        
    return {
        "ats_score": score,
        "ats_issues": issues,
        "matched_skills": extracted_skills,
        "missing_skills": []  # Will be populated when comparing with job description
    }