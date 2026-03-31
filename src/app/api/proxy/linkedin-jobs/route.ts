import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  console.log('LinkedIn API called with query:', query);
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Use a working job API from RapidAPI
    console.log('Using RapidAPI for real job data...');
    const apiKey = process.env.RAPIDAPI_KEY;
    
    if (!apiKey || apiKey === 'demo-key') {
      console.log('No valid RapidAPI key found');
      throw new Error('Valid RapidAPI key required');
    }
    
    // Try Jobicy API (free tier available)
    const jobicyUrl = `https://jobicy.p.rapidapi.com/api/v2/en/jobs?search=${encodeURIComponent(query)}&location=Remote`;
    
    const response = await fetch(jobicyUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jobicy.p.rapidapi.com'
      }
    });
    
    console.log('Jobicy API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Jobicy API response:', data);
      
      // Transform Jobicy API response to our format
      const jobs = data.jobs?.map((job: any) => ({
        id: `jobicy-${job.id}`,
        title: job.jobTitle,
        company: job.companyName,
        location: job.jobGeo || 'Remote',
        description: job.jobDescription,
        platform: 'jobicy' as const,
        url: job.jobUrl,
        postedDate: job.pubDate ? new Date(job.pubDate).toLocaleDateString() : 'Recently posted',
        salary: job.salaryMin && job.salaryMax 
          ? `$${job.salaryMin}-${job.salaryMax}` 
          : job.salaryMin ? `$${job.salaryMin}+` : 'Competitive salary',
        experience: 'Experience required',
        skills: extractSkillsFromDescription(job.jobDescription)
      })) || [];
      
      console.log('Real jobs from Jobicy:', jobs.length);
      
      if (jobs.length > 0) {
        return NextResponse.json({ 
          jobs: jobs,
          total: jobs.length 
        });
      }
    } else {
      const errorText = await response.text();
      console.error('Jobicy API error:', errorText);
    }
    
    // Try RemoteOK API as backup
    console.log('Trying RemoteOK API as backup...');
    const remoteOkUrl = `https://remoteok.p.rapidapi.com/api?search=${encodeURIComponent(query)}`;
    
    const remoteOkResponse = await fetch(remoteOkUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'remoteok.p.rapidapi.com'
      }
    });
    
    console.log('RemoteOK API response status:', remoteOkResponse.status);
    
    if (remoteOkResponse.ok) {
      const remoteOkData = await remoteOkResponse.json();
      console.log('RemoteOK API response:', remoteOkData);
      
      const remoteOkJobs = remoteOkData.map((job: any) => ({
        id: `remoteok-${job.id}`,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        description: job.description,
        platform: 'remoteok' as const,
        url: job.url,
        postedDate: job.date ? new Date(job.date).toLocaleDateString() : 'Recently posted',
        salary: job.salary ? job.salary : 'Competitive salary',
        experience: 'Experience required',
        skills: extractSkillsFromDescription(job.description)
      }));
      
      console.log('Real jobs from RemoteOK:', remoteOkJobs.length);
      
      return NextResponse.json({ 
        jobs: remoteOkJobs,
        total: remoteOkJobs.length 
      });
    } else {
      const errorText = await remoteOkResponse.text();
      console.error('RemoteOK API error:', errorText);
    }
    
    throw new Error('All real APIs failed');

  } catch (error) {
    console.error('All real job APIs failed:', error);
    
    // Only use mock data as absolute last resort
    return NextResponse.json({
      error: 'Unable to fetch real job data. Please check your RapidAPI key and try a different job API.',
      jobs: [],
      total: 0
    }, { status: 500 });
  }
}

// Helper function to extract skills from job description
function extractSkillsFromDescription(description: string): string[] {
  if (!description) return [];
  
  const commonSkills = [
    'react', 'javascript', 'typescript', 'node.js', 'python', 'java',
    'html', 'css', 'angular', 'vue', 'docker', 'aws',
    'mongodb', 'postgresql', 'mysql', 'git', 'rest api',
    'redux', 'tailwind', 'express', 'mongodb', 'sql'
  ];
  
  const text = description.toLowerCase();
  return commonSkills.filter(skill => text.includes(skill));
}
