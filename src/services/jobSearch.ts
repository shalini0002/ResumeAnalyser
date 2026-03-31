// Job search service for fetching jobs from multiple platforms

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  platform: 'linkedin' | 'naukri' | 'instahyre' | 'wellfound';
  url: string;
  postedDate: string;
  salary?: string;
  experience?: string;
  skills: string[];
  matchScore: number;
}

interface JobSearchParams {
  skills: string[];
  experience?: string;
  location?: string;
  jobType?: string;
  remote?: boolean;
}

export const searchJobs = async (resumeText: string, params?: Partial<JobSearchParams>): Promise<JobListing[]> => {
  // Extract skills and experience from resume
  const resumeSkills = extractSkillsFromResume(resumeText);
  const experience = extractExperienceFromResume(resumeText);
  
  console.log('Resume skills extracted:', resumeSkills); // Debug log
  console.log('Experience extracted:', experience); // Debug log
  
  const searchParams: JobSearchParams = {
    skills: resumeSkills,
    experience: experience,
    ...params
  };

  console.log('Search params:', searchParams); // Debug log

  try {
    // Search all platforms in parallel
    console.log('Starting job search with params:', searchParams);
    
    const [linkedinJobs, naukriJobs, instahyreJobs, wellfoundJobs] = await Promise.allSettled([
      searchLinkedIn(searchParams),
      searchNaukri(searchParams),
      searchInstahyre(searchParams),
      searchWellfound(searchParams)
    ]);

    console.log('Job search results:', {
      linkedin: linkedinJobs.status,
      naukri: naukriJobs.status,
      instahyre: instahyreJobs.status,
      wellfound: wellfoundJobs.status
    });

    const allJobs: JobListing[] = [
      ...(linkedinJobs.status === 'fulfilled' ? linkedinJobs.value : []),
      ...(naukriJobs.status === 'fulfilled' ? naukriJobs.value : []),
      ...(instahyreJobs.status === 'fulfilled' ? instahyreJobs.value : []),
      ...(wellfoundJobs.status === 'fulfilled' ? wellfoundJobs.value : [])
    ];

    console.log('Total jobs fetched:', allJobs.length);

    // Sort by match score and return top results
    return allJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 50); // Return top 50 jobs
  } catch (error) {
    console.error('Job search error:', error);
    return [];
  }
};

// LinkedIn job search - fetch real jobs from LinkedIn
const searchLinkedIn = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    // Since direct LinkedIn API requires authentication, we'll use a web scraping approach
    // In production, this should be replaced with official LinkedIn API
    const query = buildSearchQuery(params);
    const response = await fetch(`/api/proxy/linkedin-jobs?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('LinkedIn search failed');
    }

    const data = await response.json();
    console.log('LinkedIn API response:', data); // Debug log
    
    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.error('LinkedIn API returned invalid data:', data);
      return [];
    }
    
    const processedJobs = data.jobs.map((job: any) => ({
      id: `linkedin-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      platform: 'linkedin' as const,
      url: job.url,
      postedDate: job.postedDate,
      salary: job.salary,
      experience: job.experience,
      skills: extractSkillsFromText(job.description),
      matchScore: calculateMatchScore(params.skills, job.description)
    }));
    
    console.log('LinkedIn processed jobs count:', processedJobs.length); // Debug log
    return processedJobs;
  } catch (error) {
    console.error('LinkedIn search error:', error);
    return [];
  }
};

// Naukri job search - fetch real jobs from Naukri
const searchNaukri = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = buildSearchQuery(params);
    const response = await fetch(`/api/proxy/naukri-jobs?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Naukri search failed');
    }

    const data = await response.json();
    return data.jobs.map((job: any) => ({
      id: `naukri-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      platform: 'naukri' as const,
      url: job.url,
      postedDate: job.postedDate,
      salary: job.salary,
      experience: job.experience,
      skills: extractSkillsFromText(job.description),
      matchScore: calculateMatchScore(params.skills, job.description)
    }));
  } catch (error) {
    console.error('Naukri search error:', error);
    return [];
  }
};

// Instahyre job search - fetch real jobs from Instahyre
const searchInstahyre = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = buildSearchQuery(params);
    const response = await fetch(`/api/proxy/instahyre-jobs?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Instahyre search failed');
    }

    const data = await response.json();
    return data.jobs.map((job: any) => ({
      id: `instahyre-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      platform: 'instahyre' as const,
      url: job.url,
      postedDate: job.postedDate,
      salary: job.salary,
      experience: job.experience,
      skills: extractSkillsFromText(job.description),
      matchScore: calculateMatchScore(params.skills, job.description)
    }));
  } catch (error) {
    console.error('Instahyre search error:', error);
    return [];
  }
};

// Wellfound job search - fetch real jobs from Wellfound
const searchWellfound = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = buildSearchQuery(params);
    const response = await fetch(`/api/proxy/wellfound-jobs?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Wellfound search failed');
    }

    const data = await response.json();
    return data.jobs.map((job: any) => ({
      id: `wellfound-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      platform: 'wellfound' as const,
      url: job.url,
      postedDate: job.postedDate,
      salary: job.salary,
      experience: job.experience,
      skills: extractSkillsFromText(job.description),
      matchScore: calculateMatchScore(params.skills, job.description)
    }));
  } catch (error) {
    console.error('Wellfound search error:', error);
    return [];
  }
};

// Helper functions
const extractSkillsFromResume = (text: string): string[] => {
  const skills = [
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
  return skills.filter(skill => 
    textLower.includes(skill) || 
    textLower.includes(skill.replace('.', '')) ||
    textLower.includes(skill.replace('-', ' '))
  );
};

const extractExperienceFromResume = (text: string): string => {
  // Extract years of experience from resume
  const experienceRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i;
  const match = text.match(experienceRegex);
  
  if (match) {
    return match[1] + '+ years';
  }
  
  // Look for common experience indicators
  if (text.toLowerCase().includes('fresher') || text.toLowerCase().includes('entry level')) {
    return '0-1 years';
  }
  
  if (text.toLowerCase().includes('senior') || text.toLowerCase().includes('lead')) {
    return '5+ years';
  }
  
  return '2-5 years'; // Default assumption
};

const extractSkillsFromText = (text: string): string[] => {
  const skills = [
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
  return skills.filter(skill => 
    textLower.includes(skill) || 
    textLower.includes(skill.replace('.', '')) ||
    textLower.includes(skill.replace('-', ' '))
  );
};

const buildSearchQuery = (params: JobSearchParams): string => {
  const queryParts: string[] = [];
  
  if (params.skills.length > 0) {
    queryParts.push(params.skills.slice(0, 5).join(' ')); // Limit to top 5 skills
  }
  
  if (params.experience) {
    queryParts.push(params.experience);
  }
  
  if (params.location) {
    queryParts.push(params.location);
  }
  
  if (params.jobType) {
    queryParts.push(params.jobType);
  }
  
  const finalQuery = queryParts.join(' ');
  console.log('Final search query:', finalQuery); // Debug log
  
  return finalQuery;
};

const calculateMatchScore = (resumeSkills: string[], jobDescription: string): number => {
  const jobSkills = extractSkillsFromText(jobDescription);
  const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
  
  if (jobSkills.length === 0) return 50; // Default score if no skills found
  
  const matchPercentage = (matchedSkills.length / jobSkills.length) * 100;
  return Math.round(matchPercentage);
};
