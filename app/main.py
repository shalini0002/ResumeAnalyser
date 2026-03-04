from fastapi import FastAPI
from app.routes import health, resume, jd

app = FastAPI(title="Resume Analyser API")

app.include_router(health.router)
app.include_router(resume.router)
app.include_router(jd.router)

@app.get("/")
def read_root():
    return {'message': 'Welcome to Resume Analyser API'}
