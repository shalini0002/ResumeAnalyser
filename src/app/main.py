from fastapi import FastAPI
from app.routes import health, resume, jd
from app.routes.resume_ai_suggestions import router as ai_router
from app.routes.bullet_rewriter import router as bullet_router
from app.routes.skill_extractor import router as skill_router

app = FastAPI(title="Resume Analyser API")

app.include_router(health.router)
app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(ai_router)
app.include_router(bullet_router)
app.include_router(skill_router)

@app.get("/")
def read_root():
    return {'message': 'Welcome to Resume Analyser API'}
