import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Mock Wellfound job search data
    const mockJobs = [
      {
        id: '1',
        title: 'Full Stack Engineer',
        company: 'AI Startup',
        location: 'San Francisco, CA',
        description: 'Looking for Full Stack Engineers passionate about building AI products...',
        url: 'https://wellfound.com/jobs/full-stack-engineer',
        postedDate: '1 week ago',
        salary: '$130k - $180k',
        experience: '4+ years',
        skills: ['Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker']
      }
    ];

    const filteredJobs = mockJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );

    return NextResponse.json({ 
      jobs: filteredJobs,
      total: filteredJobs.length 
    });

  } catch (error) {
    console.error('Wellfound proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Wellfound jobs' }, 
      { status: 500 }
    );
  }
}
