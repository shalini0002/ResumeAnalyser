from fastapi import APIRouter, UploadFile, File
import os
from app.services.resume_parser import parse_resume
from app.services.resume_structurer import structure_resume

router = APIRouter(prefix='/resume', tags=['resume'])

UPLOAD_DIR = 'uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post('/upload')
async def upload_resume(file: UploadFile = File(...)):

    content = await file.read()

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, 'wb') as f:
        f.write(content)

    # Extract text from PDF
    extracted_text = parse_resume(file_path)

    structured_data = structure_resume(extracted_text)

    return {
        'filename': file.filename, 
        'ai_parsed_resume': structured_data,
        'text_preview': extracted_text[:500] + '...' if len(extracted_text) > 500 else extracted_text,
        'message': 'Resume uploaded and parsed successfully',
        'content_type': file.content_type,
        'file_path': file_path,
        'size_in_bytes': len(content),
        'structured_data': structured_data
    }
