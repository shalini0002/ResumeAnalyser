import os
import json 
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def parse_resume(resume_text: str) -> dict:
    prompt = """
    Extract the following information from the resume text:
    - Name
    - Email
    - Phone
    - Summary
    - Skills (array)
    - Experience (array of objects with company, role, duration, responsibilities)
    - Education
    - Projects
    - Certifications
    - Awards
    - Publications
    - Languages
    - Interests
    - References

    Resume Text:
    {resume_text}
    """
    response = model.generate_content(prompt)
    raw_text = response.text.strip()

    # clean up the response text to remove any markdown or extra characters
    if raw_text.strip("```"):
        raw_text= raw_text.replace("```json", "").replace("```", "").strip()
        
    return json.loads(raw_text)