"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";
import { searchJobs, JobListing } from "../../services/jobSearch";
import { useSnackbar } from "../../components/Snackbar";

export default function JobsPage() {
    const router = useRouter();
    const { showSnackbar, SnackbarComponent } = useSnackbar();
    const { isAuthenticated } = useAuth();
    const [resumeText, setResumeText] = useState("");
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        jobType: "",
        remote: false
    });
    const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

    useEffect(() => {
        const savedResumeText = localStorage.getItem('resumeText') || sessionStorage.getItem('resumeText');
        
        if (savedResumeText) {
            setResumeText(savedResumeText);
            searchForJobs(savedResumeText);
        } else {
            showSnackbar('Please upload a resume first to find matching jobs', 'warning');
            router.push('/');
        }
    }, []);

    const searchForJobs = async (text: string, customFilters?: typeof filters) => {
        setLoading(true);
        try {
            const searchParams = {
                ...customFilters || filters,
                skills: []
            };
            
            const jobResults = await searchJobs(text, searchParams);
            setJobs(jobResults);
            
            if (jobResults.length === 0) {
                showSnackbar('No jobs found matching your profile', 'info');
            } else {
                showSnackbar(`Found ${jobResults.length} jobs matching your profile!`, 'success');
            }
        } catch (error) {
            console.error('Job search error:', error);
            showSnackbar('Failed to search for jobs. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        if (resumeText) {
            searchForJobs(resumeText, newFilters);
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (selectedPlatform !== "all" && job.platform !== selectedPlatform) {
            return false;
        }
        return true;
    });

    const getPlatformColor = (platform: string) => {
        switch(platform) {
            case 'linkedin': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'naukri': return 'bg-green-100 text-green-800 border-green-300';
            case 'instahyre': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'wellfound': return 'bg-orange-100 text-orange-800 border-orange-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300 rounded-full opacity-20 transform rotate-12"></div>
                <div className="absolute top-40 right-20 w-16 h-16 border-2 border-purple-300 rounded-lg opacity-15 transform -rotate-6"></div>
                <div className="absolute bottom-20 left-20 w-24 h-12 border-2 border-green-300 rounded-full opacity-10 transform rotate-45"></div>
                <div className="absolute top-60 left-40 w-12 h-12 border-2 border-yellow-300 rounded opacity-25"></div>
                <div className="absolute bottom-40 right-10 w-32 h-8 border-2 border-pink-300 rounded-full opacity-20 transform -rotate-12"></div>
            </div>

            <Navigation />

            <div className="relative z-10 flex-1 p-4 lg:p-8 pt-20">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 relative">
                        <span className="relative">
                            Jobs Matching Your Profile
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 transform -skew-x-12"></div>
                        </span>
                    </h1>

                    {/* Filters */}
                    <div className="mb-8 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-6 relative">
                        <div className="absolute inset-0 opacity-3 rounded-lg">
                            <div className="h-full w-full rounded-lg" style={{ 
                                backgroundImage: `repeating-linear-gradient(
                                    90deg,
                                    transparent,
                                    transparent 1px,
                                    rgba(0,0,0,0.02) 1px,
                                    rgba(0,0,0,0.02) 2px
                                )`
                            }}></div>
                        </div>
                        
                        <div className="relative">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="City, Country..."
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Job Type</label>
                                    <select
                                        value={filters.jobType}
                                        onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Types</option>
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Platform</label>
                                    <select
                                        value={selectedPlatform}
                                        onChange={(e) => setSelectedPlatform(e.target.value)}
                                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Platforms</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="naukri">Naukri</option>
                                        <option value="instahyre">Instahyre</option>
                                        <option value="wellfound">Wellfound</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.remote}
                                            onChange={(e) => handleFilterChange('remote', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Remote Only</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-4 text-gray-600">Searching for jobs...</p>
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-xl border-2 border-gray-200">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
                                <p className="text-gray-600">Try adjusting your filters or upload a more detailed resume</p>
                            </div>
                        ) : (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-lg shadow-xl border-2 border-gray-200 p-6 hover:shadow-2xl transition-shadow relative">
                                    <div className="absolute inset-0 opacity-5 rounded-lg">
                                        <div className="h-full w-full rounded-lg" style={{ 
                                            backgroundImage: `repeating-linear-gradient(
                                                45deg,
                                                transparent,
                                                transparent 1px,
                                                rgba(0,0,0,0.01) 1px,
                                                rgba(0,0,0,0.01) 2px
                                            )`
                                        }}></div>
                                    </div>
                                    
                                    <div className="relative">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <span className="text-gray-600 font-medium">{job.company}</span>
                                                    <span className="text-gray-500">•</span>
                                                    <span className="text-gray-600">{job.location}</span>
                                                    <span className="text-gray-500">•</span>
                                                    <span className="text-gray-600">{job.postedDate}</span>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlatformColor(job.platform)}`}>
                                                        {job.platform.charAt(0).toUpperCase() + job.platform.slice(1)}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.matchScore)}`}>
                                                        {job.matchScore}% Match
                                                    </span>
                                                    {job.salary && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                                                            {job.salary}
                                                        </span>
                                                    )}
                                                    {job.experience && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                                            {job.experience}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2 mt-4 lg:mt-0">
                                                <a
                                                    href={job.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                                >
                                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                                    <span className="relative text-sm">Apply Now</span>
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <p className="text-gray-700 line-clamp-3">{job.description}</p>
                                        </div>
                                        
                                        {job.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills.slice(0, 8).map((skill: string, index: number) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 8 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                        +{job.skills.length - 8} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {SnackbarComponent}
        </div>
    );
}
