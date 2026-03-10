🚀 AI Resume Analyzer & Job Matcher

An AI-powered Resume Analyzer that extracts resume data, analyzes it, and matches it with job descriptions using semantic AI matching and ATS scoring.

This system converts resumes into structured data, compares them with job descriptions, and provides insights like:

ATS Score

Resume vs Job Match %

Resume Improvements

AI Resume Bullet Enhancements

Built with FastAPI, Gemini AI, and Python.

✨ Features
📄 Resume Upload

Upload a PDF/DOC resume which is automatically parsed into plain text.

🤖 AI Resume Parsing

Using Gemini AI, the resume is structured into:

Skills

Experience

Education

Projects

Achievements

📊 ATS Score Calculation

Analyzes how well the resume passes Applicant Tracking Systems (ATS).

Score is calculated based on:

Keyword matching

Skills coverage

Job relevance

Experience alignment

🎯 Resume vs Job Matching

Uses semantic AI embeddings to calculate how closely the resume matches a job description.

Outputs:

Match percentage

Missing skills

Strength areas

✍️ AI Resume Bullet Rewriter

Improves weak resume statements.

Example:

Input

Built React applications

AI Output

Developed high-performance React applications using modern hooks and optimized rendering, improving UI responsiveness.
🏗️ Tech Stack
Backend

Python

FastAPI

Uvicorn

AI

Google Gemini API

Gemini Embeddings

Database

PostgreSQL

SQLAlchemy ORM

File Parsing

pdfplumber

Other

python-dotenv

numpy

📂 Project Structure
resume-analyser
│
├── app
│   ├── main.py
│   │
│   ├── routes
│   │   ├── resume.py
│   │   └── jd.py
│   │
│   ├── services
│   │   ├── gemini_parser.py
│   │   ├── embedding_service.py
│   │   ├── jd_matcher.py
│   │   └── ats_engine.py
│   │
│   └── utils
│       └── pdf_parser.py
│
├── requirements.txt
├── .env
└── README.md
⚙️ Installation & Setup
1️⃣ Check Python Installation
python --version
pip --version
2️⃣ Create Project Folder
mkdir resume-analyser
cd resume-analyser
3️⃣ Create Virtual Environment
python -m venv venv

Activate it:

Mac/Linux
source venv/bin/activate
Windows
venv\Scripts\activate
4️⃣ Install Dependencies
pip install fastapi uvicorn python-multipart sqlalchemy psycopg2-binary python-dotenv
📦 File Upload Support
pip install python-multipart
📄 Install PDF Parser

Used for extracting text from resumes.

pip install pdfplumber
🤖 Install Gemini AI SDK
pip install google-generativeai python-dotenv
🧠 Install Embedding Support
pip install numpy
📦 Freeze Dependencies
pip freeze > requirements.txt
🔑 Environment Variables

Create a .env file:

GEMINI_API_KEY=your_gemini_api_key_here
🚀 Run the Server

Start the FastAPI server:

uvicorn app.main:app --reload

Server will run on:

http://127.0.0.1:8000

Swagger API docs:

http://127.0.0.1:8000/docs
📄 Resume Upload API

Endpoint:

POST /resume/upload

Function:

Upload resume file

Convert PDF → Text

Parse resume using Gemini AI

Return structured resume data

📑 Job Description API

Endpoint:

POST /jd/analyze

Function:

Accept Job Description

Generate embeddings

Compare with resume embeddings

Calculate match score

🧠 Hybrid ATS + AI Matching Engine

The system uses two matching strategies:

1️⃣ ATS Keyword Matching

Checks keyword overlap

Measures skill coverage

Calculates ATS compatibility score

2️⃣ Semantic AI Matching

Using Gemini embeddings to understand context.

Example:

Resume: React.js
Job: Frontend Frameworks

Even if keywords differ, AI detects semantic similarity.

📊 Example Output
ATS Score: 82%

Job Match: 76%

Strengths:
- React.js
- JavaScript
- REST APIs

Missing Skills:
- Docker
- Kubernetes
- GraphQL

  # 🚀 AI Resume Analyzer – Frontend Setup

This project is the **frontend application** for the AI Resume Analyzer platform.
It allows users to upload their resume, analyze ATS score, compare with job descriptions, and improve resume bullets using AI.

The frontend is built using **Next.js (App Router)**.

---

# 🧰 Tech Stack

* **Next.js 14**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **FastAPI Backend**

---

# 🚀 Step 1 — Create the Frontend Project

Create a new Next.js application.

```bash
npx create-next-app@latest ai-resume-analyzer
```

During setup choose:

```
✔ TypeScript → Yes
✔ Tailwind CSS → Yes
✔ App Router → Yes
✔ src directory → Yes
```

Navigate into the project folder:

```bash
cd ai-resume-analyzer
```

---

# 📂 Step 2 — Recommended Folder Structure

Create the following folders and files inside the **src** directory.

```
src
 ├ app
 │  ├ page.tsx
 │  ├ upload
 │  │   └ page.tsx
 │  ├ analyze
 │  │   └ page.tsx
 │  ├ improve
 │  │   └ page.tsx
 │  └ rewrite
 │      └ page.tsx
 │
 ├ components
 │   ├ UploadResume.tsx
 │   ├ ATSScoreCard.tsx
 │   ├ JobMatch.tsx
 │   └ BulletRewrite.tsx
 │
 ├ services
 │   └ api.ts
```

### Folder Explanation

| Folder        | Purpose                        |
| ------------- | ------------------------------ |
| `app/`        | Next.js App Router pages       |
| `components/` | Reusable UI components         |
| `services/`   | API calls to backend           |
| `upload/`     | Resume upload page             |
| `analyze/`    | ATS score + resume analysis    |
| `improve/`    | Resume improvement suggestions |
| `rewrite/`    | AI bullet rewriting feature    |

---

# 🧠 Step 3 — Create API Service

Create a service file to communicate with the **FastAPI backend**.

File:

```
src/services/api.ts
```

This file keeps **all backend communication centralized**.

---

# 🎨 Step 4 — Build Resume Upload Page

Create the upload page:

```
src/app/upload/page.tsx
```

This page will allow users to:

* Upload their resume (PDF)
* Send the file to the backend
* Extract resume text
* Continue to ATS analysis

Later we will connect it to the **UploadResume component**.

---

# ▶️ Run the Frontend

Start the development server:

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---


🧠 Future Improvements

AI Resume Improvement Suggestions

Resume Bullet Optimizer

Cover Letter Generator

AI Job Recommendation Engine

Recruiter Dashboard

👩‍💻 Author

Shalini Sharma

Full Stack Developer | AI Enthusiast

Skills:

React

Node.js

Python

FastAPI

Generative AI

LLM Applications

💡 This project demonstrates how AI can transform the recruitment pipeline by making resume screening intelligent and automated.
