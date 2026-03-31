import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Mock Naukri job search data
    const mockJobs = [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'InfoTech Solutions',
        location: 'Bangalore, India',
        description: 'We are hiring Software Engineers with strong programming skills...',
        url: 'https://naukri.com/job-listings/software-engineer',
        postedDate: '1 day ago',
        salary: '₹15-25 LPA',
        experience: '3+ years',
        skills: ['Java', 'Spring Boot', 'MySQL', 'React', 'JavaScript']
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'WebDev Inc',
        location: 'Mumbai, India', 
        description: 'Looking for Frontend Developers with modern web development experience...',
        url: 'https://naukri.com/job-listings/frontend-developer',
        postedDate: '3 days ago',
        salary: '₹12-20 LPA',
        experience: '2+ years',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js']
      }
    ];

    // More flexible matching - check if any skill matches or if query is in title/company
    const filteredJobs = mockJobs.filter(job => {
      const queryLower = query.toLowerCase();
      const jobText = `${job.title} ${job.company} ${job.skills.join(' ')}`.toLowerCase();
      
      // Check if query matches any part of job information
      return queryLower.split(' ').some(word => 
        word.length > 2 && jobText.includes(word)
      ) || job.skills.some(skill => 
        skill.toLowerCase().includes(queryLower) || queryLower.includes(skill.toLowerCase())
      );
    });

    return NextResponse.json({ 
      jobs: filteredJobs,
      total: filteredJobs.length 
    });

  } catch (error) {
    console.error('Naukri proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Naukri jobs' }, 
      { status: 500 }
    );
  }
}
