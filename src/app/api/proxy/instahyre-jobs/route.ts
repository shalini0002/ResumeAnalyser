import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Mock Instahyre job search data
    const mockJobs = [
      {
        id: '1',
        title: 'React Developer',
        company: 'TechStart',
        location: 'Pune, India',
        description: 'Hiring React Developers with experience in modern web technologies...',
        url: 'https://instahyre.com/jobs/react-developer',
        postedDate: '2 days ago',
        salary: '₹10-18 LPA',
        experience: '2+ years',
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB']
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
    console.error('Instahyre proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instahyre jobs' }, 
      { status: 500 }
    );
  }
}
