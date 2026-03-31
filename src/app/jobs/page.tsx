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

    const getPlatformColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'linkedin':
                return 'bg-blue-100 text-blue-800 border border-blue-300';
            case 'naukri':
                return 'bg-green-100 text-green-800 border border-green-300';
            case 'instahyre':
                return 'bg-purple-100 text-purple-800 border border-purple-300';
            case 'wellfound':
                return 'bg-orange-100 text-orange-800 border border-orange-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const searchForJobs = async (resumeText: string) => {
        if (!resumeText.trim()) return;
        
        setLoading(true);
        try {
            const jobListings = await searchJobs(resumeText);
            setJobs(jobListings);
        } catch (error) {
            console.error('Job search error:', error);
            showSnackbar('Failed to search for jobs. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedResumeText = localStorage.getItem('resumeText') || sessionStorage.getItem('resumeText');
        
        if (savedResumeText) {
            setResumeText(savedResumeText);
            searchForJobs(savedResumeText);
        } else {
            // If no resume text, still show some default jobs
            console.log('No resume text found, showing default jobs');
            searchForJobs('developer react javascript'); // Default search terms
        }
    }, [router]);

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

                    {/* Jobs Header */}
                    <div className="mb-8 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 p-6 relative">
                        <div className="absolute inset-0 opacity-5 rounded-2xl">
                            <div className="h-full w-full rounded-2xl" style={{ 
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
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2 relative">
                                        <span className="relative">
                                            🎯 Job Recommendations
                                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 transform -skew-x-12"></div>
                                        </span>
                                    </h2>
                                    <p className="text-gray-700">
                                        Based on your resume skills and experience
                                    </p>
                                </div>
                                
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {jobs.length}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Matching Jobs
                                    </div>
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
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-2xl border-4 border-gray-200">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 relative">
                                    <span className="relative">
                                        No Jobs Found
                                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 transform -skew-x-12"></div>
                                    </span>
                                </h3>
                                <p className="text-gray-700">Please upload your resume first to get matching job recommendations</p>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-xl border-2 border-gray-800 transform -rotate-1 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <span className="relative">
                                        Upload Resume
                                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white transform -skew-x-12"></div>
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {jobs.map((job: JobListing, index: number) => (
                                    <div key={job.id} className="bg-white rounded-2xl shadow-2xl border-4 border-gray-200 p-6 relative hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                                        {/* Paper Texture Background */}
                                        <div className="absolute inset-0 opacity-5 rounded-2xl">
                                            <div className="h-full w-full rounded-2xl" style={{ 
                                                backgroundImage: `repeating-linear-gradient(
                                                    45deg,
                                                    transparent,
                                                    transparent 1px,
                                                    rgba(0,0,0,0.01) 1px,
                                                    rgba(0,0,0,0.01) 2px
                                                )`
                                            }}></div>
                                        </div>
                                        
                                        {/* Doodle element */}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-yellow-300 rounded-full transform rotate-12 opacity-60"></div>
                                        
                                        <div className="relative">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800 mb-1 relative">
                                                        <span className="relative">
                                                            {job.title}
                                                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 transform -skew-x-12"></div>
                                                        </span>
                                                    </h3>
                                                    <p className="text-gray-700 font-medium mb-1">{job.company}</p>
                                                    <p className="text-gray-600 text-sm">{job.location}</p>
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
                                            
                                            <div className="flex gap-2 mt-4">
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
                                            
                                            <div className="mb-3 mt-4">
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {SnackbarComponent}
        </div>
    );
}
