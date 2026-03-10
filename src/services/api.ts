const API_URL = "http://localhost:8001";

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_URL}/resume/upload`, {
    method: "POST",
    body: formData,
  });
  
  return response.json();
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

