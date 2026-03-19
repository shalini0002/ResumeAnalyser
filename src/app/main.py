from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, resume, jd, auth
from app.routes.resume_ai_suggestions import router as ai_router
from app.routes.bullet_rewriter import router as bullet_router
from app.routes.skill_extractor import router as skill_router
from app.core.database import Database

app = FastAPI(title="Resume Analyser API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(ai_router)
app.include_router(bullet_router)
app.include_router(skill_router)

@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    Database.connect()

@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    Database.disconnect()

@app.get("/")
def read_root():
    return {'message': 'Welcome to Resume Analyser API'}
