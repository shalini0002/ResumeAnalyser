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
  
  const searchParams: JobSearchParams = {
    skills: resumeSkills,
    experience: experience,
    ...params
  };

  try {
    // Search all platforms in parallel
    const [linkedinJobs, naukriJobs, instahyreJobs, wellfoundJobs] = await Promise.allSettled([
      searchLinkedIn(searchParams),
      searchNaukri(searchParams),
      searchInstahyre(searchParams),
      searchWellfound(searchParams)
    ]);

    const allJobs: JobListing[] = [
      ...(linkedinJobs.status === 'fulfilled' ? linkedinJobs.value : []),
      ...(naukriJobs.status === 'fulfilled' ? naukriJobs.value : []),
      ...(instahyreJobs.status === 'fulfilled' ? instahyreJobs.value : []),
      ...(wellfoundJobs.status === 'fulfilled' ? wellfoundJobs.value : [])
    ];

    // Sort by match score and return top results
    return allJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 50); // Return top 50 jobs
  } catch (error) {
    console.error('Job search error:', error);
    return [];
  }
};

// Mock job search - only returns matching jobs based on resume skills
const searchLinkedIn = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    // Generate mock jobs that match the resume skills
    const mockJobs: JobListing[] = [
      {
        id: `linkedin-${Date.now()}-1`,
        title: `${params.skills[0] || 'React'} Developer`,
        company: 'TechCorp Solutions',
        location: params.location || 'Bangalore, India',
        description: `We are looking for a skilled ${params.skills[0] || 'React'} Developer with experience in ${params.experience || '3-5 years'}. Key skills include: ${params.skills.slice(0, 3).join(', ')}.`,
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/jobs/react-developer',
        postedDate: new Date().toISOString(),
        salary: '₹8-15 LPA',
        experience: params.experience || '3-5 years',
        skills: params.skills.slice(0, 5),
        matchScore: 95
      },
      {
        id: `linkedin-${Date.now()}-2`,
        title: `Senior ${params.skills[1] || 'TypeScript'} Engineer`,
        company: 'Digital Innovations Pvt Ltd',
        location: params.location || 'Pune, India',
        description: `Join our team as a Senior ${params.skills[1] || 'TypeScript'} Engineer. Required skills: ${params.skills.slice(0, 4).join(', ')}. Remote work available.`,
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/jobs/typescript-engineer',
        postedDate: new Date(Date.now() - 86400000).toISOString(),
        salary: '₹12-20 LPA',
        experience: params.experience || '5+ years',
        skills: params.skills.slice(0, 5),
        matchScore: 88
      },
      {
        id: `linkedin-${Date.now()}-3`,
        title: `Full Stack ${params.skills[2] || 'Node.js'} Developer`,
        company: 'StartupHub India',
        location: params.location || 'Remote',
        description: `Looking for experienced ${params.skills[2] || 'Node.js'} Developer with strong knowledge of ${params.skills.slice(1, 4).join(', ')}. Competitive salary and benefits.`,
        platform: 'linkedin' as const,
        url: 'https://linkedin.com/jobs/nodejs-developer',
        postedDate: new Date(Date.now() - 172800000).toISOString(),
        salary: '₹10-18 LPA',
        experience: params.experience || '3-5 years',
        skills: params.skills.slice(0, 5),
        matchScore: 82
      }
    ];

    return mockJobs;
  } catch (error) {
    console.error('LinkedIn search error:', error);
    return [];
  }
};

// Naukri job search - mock matching jobs
const searchNaukri = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    // Generate mock jobs that match the resume skills
    const mockJobs: JobListing[] = [
      {
        id: `naukri-${Date.now()}-1`,
        title: `${params.skills[0] || 'React'} Developer - ${params.experience || '3-5 years'}`,
        company: 'InfoTech Systems',
        location: params.location || 'Mumbai, India',
        description: `Leading IT company seeking ${params.skills[0] || 'React'} Developer. Must have experience in ${params.skills.slice(0, 3).join(', ')}. Great work culture.`,
        platform: 'naukri' as const,
        url: 'https://naukri.com/job-listings',
        postedDate: new Date().toISOString(),
        salary: '₹7-12 LPA',
        experience: params.experience || '3-5 years',
        skills: params.skills.slice(0, 5),
        matchScore: 92
      },
      {
        id: `naukri-${Date.now()}-2`,
        title: `Frontend Developer - ${params.skills[1] || 'JavaScript'} Specialist`,
        company: 'Global Software Solutions',
        location: params.location || 'Hyderabad, India',
        description: `Urgent opening for Frontend Developer with expertise in ${params.skills.slice(1, 4).join(', ')}. Work with latest technologies.`,
        platform: 'naukri' as const,
        url: 'https://naukri.com/job-listings',
        postedDate: new Date(Date.now() - 43200000).toISOString(),
        salary: '₹9-16 LPA',
        experience: params.experience || '3-5 years',
        skills: params.skills.slice(0, 5),
        matchScore: 85
      }
    ];

    return mockJobs;
  } catch (error) {
    console.error('Naukri search error:', error);
    return [];
  }
};

// Instahyre job search - mock matching jobs
const searchInstahyre = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    // Generate mock jobs that match the resume skills
    const mockJobs: JobListing[] = [
      {
        id: `instahyre-${Date.now()}-1`,
        title: `${params.skills[0] || 'React'} Developer - Remote`,
        company: 'TechStart Innovations',
        location: 'Remote (India)',
        description: `Fully remote position for ${params.skills[0] || 'React'} Developer. Looking for candidates with strong ${params.skills.slice(0, 3).join(', ')} skills.`,
        platform: 'instahyre' as const,
        url: 'https://instahyre.com/jobs',
        postedDate: new Date().toISOString(),
        salary: '₹8-14 LPA',
        experience: params.experience || '3-5 years',
        skills: params.skills.slice(0, 5),
        matchScore: 90
      }
    ];

    return mockJobs;
  } catch (error) {
    console.error('Instahyre search error:', error);
    return [];
  }
};

// Wellfound job search - mock matching jobs
const searchWellfound = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    // Generate mock jobs that match the resume skills
    const mockJobs: JobListing[] = [
      {
        id: `wellfound-${Date.now()}-1`,
        title: `Senior ${params.skills[1] || 'TypeScript'} Developer - Startup`,
        company: 'NextGen Tech Labs',
        location: params.location || 'Bangalore, India',
        description: `Exciting startup opportunity for Senior ${params.skills[1] || 'TypeScript'} Developer. Equity options available. Skills: ${params.skills.slice(0, 4).join(', ')}.`,
        platform: 'wellfound' as const,
        url: 'https://wellfound.com/jobs',
        postedDate: new Date(Date.now() - 86400000).toISOString(),
        salary: '₹15-25 LPA + Equity',
        experience: params.experience || '5+ years',
        skills: params.skills.slice(0, 5),
        matchScore: 94
      }
    ];

    return mockJobs;
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
  
  return queryParts.join(' ');
};

const calculateMatchScore = (resumeSkills: string[], jobDescription: string): number => {
  const jobSkills = extractSkillsFromText(jobDescription);
  const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
  
  if (jobSkills.length === 0) return 50; // Default score if no skills found
  
  const matchPercentage = (matchedSkills.length / jobSkills.length) * 100;
  return Math.round(matchPercentage);
};
