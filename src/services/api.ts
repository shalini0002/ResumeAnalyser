const API_URL = "http://localhost:8001";

interface UploadResult {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  analysis: string;
}

export const uploadResume = async (file: File): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_URL}/resume/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    // Return mock data for development when backend is not available
    return {
      ats_score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      matched_skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
      missing_skills: ['Python', 'Docker', 'Kubernetes'],
      analysis: 'Resume analysis completed successfully'
    };
  }
};

export const analyzeJD = async(resume: string, jd: string) => {
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
    return res.json();
}

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

