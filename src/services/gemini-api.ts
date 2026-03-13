// Gemini AI service for frontend analysis when backend is not available

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyD1JFzKs1K4U1sV-EqfbYWyNWVeWgtZ0EI';

interface AnalysisResult {
  ats_score: number;
  semantic_result: {
    overall_match_score: number;
    semantic_score: number;
    skill_score: number;
    ats_score: number;
    matched_skills: string[];
    missing_skills: string[];
    ats_issues: string[];
  };
  rewrite_suggestions: string[];
  skill_gap_analysis: string[];
  improvement_suggestions: string[];
  message: string;
}

export const analyzeWithGemini = async(resume: string, jobDescription: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze the following resume against the job description and provide a detailed analysis in JSON format:

Resume:
${resume}

Job Description:
${jobDescription}

Please provide the analysis in this exact JSON format:
{
  "ats_score": <number between 0-100>,
  "semantic_result": {
    "overall_match_score": <number between 0-100>,
    "semantic_score": <number between 0-100>,
    "skill_score": <number between 0-100>,
    "ats_score": <number between 0-100>,
    "matched_skills": ["skill1", "skill2", ...],
    "missing_skills": ["skill1", "skill2", ...],
    "ats_issues": ["issue1", "issue2", ...]
  },
  "rewrite_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "skill_gap_analysis": ["gap1", "gap2", "gap3"],
  "improvement_suggestions": ["improvement1", "improvement2", "improvement3"],
  "message": "AI Analysis Completed"
}

Focus on:
1. ATS compatibility and keyword matching
2. Semantic similarity between resume and job description
3. Skills matching and gaps
4. Specific actionable suggestions for improvement
5. Resume bullet point improvements`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Clean up the response text to extract JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    return result;
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback to basic analysis if Gemini fails
    const resumeSkills = extractSkills(resume);
    const jobSkills = extractSkills(jobDescription);
    const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
    
    const matchPercentage = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 0;
    
    return {
      ats_score: matchPercentage,
      semantic_result: {
        overall_match_score: matchPercentage,
        semantic_score: Math.min(100, matchPercentage + 10),
        skill_score: matchPercentage,
        ats_score: matchPercentage,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        ats_issues: matchPercentage < 70 ? ['Add more keywords from job description', 'Improve formatting'] : []
      },
      rewrite_suggestions: [
        'Developed and deployed web applications using modern frameworks',
        'Collaborated with cross-functional teams to deliver high-quality solutions',
        'Optimized application performance resulting in improved user experience'
      ],
      skill_gap_analysis: missingSkills.map(skill => `Consider adding ${skill} experience`),
      improvement_suggestions: [
        'Add quantifiable achievements and metrics',
        'Include more relevant keywords from job description',
        'Improve resume structure for better ATS parsing'
      ],
      message: "Basic Analysis Completed"
    };
  }
};

function extractSkills(text: string): string[] {
  const skills = [
    "react", "javascript", "typescript", "node", "node.js",
    "docker", "aws", "graphql", "sql", "nosql",
    "mongodb", "postgresql", "mysql", "next.js", "fastapi", "python",
    "django", "flask", "java", "spring", "spring boot", ".net",
    "angular", "vue", "vue.js", "html", "css", "sass", "tailwind",
    "git", "github", "gitlab", "ci/cd", "jenkins", "kubernetes",
    "redis", "elasticsearch", "mongodb", "firebase", "supabase",
    "rest", "restful", "api", "microservices", "agile", "scrum"
  ];

  const textLower = text.toLowerCase();
  return skills.filter(skill => textLower.includes(skill));
}
