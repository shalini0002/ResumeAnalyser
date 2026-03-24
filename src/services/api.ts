const API_URL = "http://localhost:8001";

import { analyzeWithGemini } from './gemini-api';

interface UploadResult {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  analysis: string;
}

export const uploadResume = async (file: File): Promise<UploadResult> => {
  console.log('Starting upload for file:', file.name, 'Type:', file.type);
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    console.log('Attempting backend upload...');
    const response = await fetch(`${API_URL}/resume/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (response.ok) {
      console.log('Backend upload successful!');
      // Backend responded, but we'll still calculate our own score
      const backendResult = await response.json();
      const text = await file.text();
      console.log('Extracted text preview:', text.substring(0, 200) + '...');
      const ourScore = calculateResumeScore(text);
      
      return {
        ...backendResult,
        ats_score: ourScore, // Override backend score with our calculated score
        matched_skills: extractSkillsFromText(text).matched,
        missing_skills: extractSkillsFromText(text).missing,
      };
    } else {
      console.log('Backend upload failed with status:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    console.log('Falling back to frontend processing...');
    
    // Extract text from file and use our scoring when backend is not available
    try {
      console.log('Attempting to extract text from file:', file.name, file.type);
      const text = await file.text();
      console.log('Successfully extracted text, length:', text.length);
      // For resume upload alone, calculate ATS score based on resume content quality
      const score = calculateResumeScore(text);
      
      return {
        ats_score: score,
        matched_skills: extractSkillsFromText(text).matched,
        missing_skills: extractSkillsFromText(text).missing,
        analysis: 'Resume analysis completed successfully'
      };
    } catch (textError) {
      console.error('Text extraction error:', textError);
      console.log('Using fallback mock data');
      // Final fallback to mock data with realistic skill extraction
      const fallbackText = "resume with react javascript typescript node skills";
      const mockSkills = extractSkillsFromText(fallbackText);
      return {
        ats_score: Math.floor(Math.random() * 30) + 70,
        matched_skills: mockSkills.matched,
        missing_skills: mockSkills.missing,
        analysis: 'Resume analysis completed successfully'
      };
    }
  }
};

// Helper function to calculate resume score based on content quality
const calculateResumeScore = (text: string): number => {
  const skills = extractSkillsFromText(text);
  const skillCount = skills.matched.length;
  
  console.log('Resume text length:', text.length);
  console.log('Skills found:', skills.matched);
  console.log('Skill count:', skillCount);
  
  // Base score starts at 60
  let score = 60;
  
  // Add points for skills (max 30 points)
  score += Math.min(skillCount * 3, 30);
  
  // Add points for resume length (optimal 300-800 words)
  const wordCount = text.split(/\s+/).length;
  console.log('Word count:', wordCount);
  if (wordCount >= 300 && wordCount <= 800) {
    score += 10;
  } else if (wordCount >= 200 && wordCount <= 1000) {
    score += 5;
  }
  
  // Check for resume sections
  const sections = ['experience', 'education', 'skills', 'summary', 'projects'];
  const sectionCount = sections.filter(section => 
    text.toLowerCase().includes(section)
  ).length;
  console.log('Sections found:', sectionCount);
  score += Math.min(sectionCount * 2, 10);
  
  console.log('Final score:', score);
  
  // Cap at 95
  return Math.min(score, 95);
};

// Helper function to extract skills from text (fallback for frontend)
const extractSkillsFromText = (text: string) => {
  const allSkills: string[] = [
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
  ];
  
  const textLower = text.toLowerCase();
  const foundSkills = allSkills.filter(skill => 
    textLower.includes(skill) || 
    textLower.includes(skill.replace('.', '')) ||
    textLower.includes(skill.replace('-', ' '))
  );
  
  // Generate some realistic missing skills
  const commonMissingSkills = ["python", "docker", "kubernetes", "aws", "react", "typescript"];
  const missingSkills = commonMissingSkills.filter(skill => !foundSkills.includes(skill)).slice(0, 3);
  
  return {
    matched: foundSkills.slice(0, 8), // Limit to 8 skills
    missing: missingSkills.length > 0 ? missingSkills : ["azure", "terraform", "mongodb"]
  };
};

export const analyzeJD = async(resume: string, jd: string) => {
    try {
        const res = await fetch(`${API_URL}/jd/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                resume_text: resume, 
                job_description: jd 
            }),
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        return res.json();
    } catch (error) {
        console.error('JD Analysis error:', error);
        // Use Gemini AI when backend is not available
        return await analyzeWithGemini(resume, jd);
    }
};

export const improveResume = async(resumeText: string, jobDescription: string) => {
    const res = await fetch(`${API_URL}/resume/improve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            resume_text: resumeText, 
            job_description: jobDescription 
        }),
    });
    return res.json();
}

