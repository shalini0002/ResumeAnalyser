"use client";

import { useState, useEffect } from "react";
import { analyzeJD } from "../../services/api";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function AnalyzePage() {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState("rewrite");
    const [resumeScore, setResumeScore] = useState<number | null>(null);

    // Load saved resume score and analysis results from localStorage/sessionStorage on component mount
    useEffect(() => {
        const savedScore = localStorage.getItem('resumeScore');
        const savedResult = sessionStorage.getItem('analysisResult');
        
        if (savedScore) {
            setResumeScore(parseInt(savedScore));
        }
        
        // Load analysis results from sessionStorage (session-specific)
        if (savedResult) {
            try {
                const parsedResult = JSON.parse(savedResult);
                setResult(parsedResult);
            } catch (error) {
                console.error('Error parsing saved result:', error);
            }
        }
        
        // Only load resume text from localStorage (home page upload) - not from sessionStorage
        const savedResumeTextFromHome = localStorage.getItem('resumeText');
        
        if (savedResumeTextFromHome) {
            setResumeText(savedResumeTextFromHome);
        } else {
            // Keep empty if no resume was uploaded on home page
            setResumeText('');
        }
        
        // Don't auto-load job description - keep it empty for fresh input
        setJobDescription('');
    }, []);

    // Save analysis results to sessionStorage when they change
    useEffect(() => {
        if (result) {
            sessionStorage.setItem('analysisResult', JSON.stringify(result));
        }
    }, [result]);

    // Save resume text to sessionStorage when it changes
    useEffect(() => {
        if (resumeText) {
            sessionStorage.setItem('resumeText', resumeText);
        }
    }, [resumeText]);

    // Save job description to sessionStorage when it changes
    useEffect(() => {
        if (jobDescription) {
            sessionStorage.setItem('jobDescription', jobDescription);
        }
    }, [jobDescription]);

    const handleAnalyze = async () => {
        if (!resumeText || !jobDescription) return;
        
        setLoading(true);
        try {
            const data = await analyzeJD(resumeText, jobDescription);
            setResult(data);
            // Update resume score from analysis if not already set
            if (!resumeScore) {
                const score = data.ats_score || data.semantic_result?.ats_score;
                setResumeScore(score);
                localStorage.setItem('resumeScore', score.toString());
            }
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const analysisCards = [
        {
            id: "rewrite",
            title: "Resume Rewriter",
            description: "AI-powered bullet point improvements",
            icon: "✍️",
            content: result?.semantic_result?.ats_issues?.length > 0 
                ? result.semantic_result.ats_issues.map((issue: string) => `${issue}`)
                : ["Your resume looks good! Consider adding more quantifiable achievements."]
        },
        {
            id: "skill-gap",
            title: "Skill Gap Analysis",
            description: "Identify missing skills for target roles",
            icon: "📊",
            content: result?.semantic_result ? [
                `✅ Matched Skills (${result.semantic_result.matched_skills?.length || 0}):`,
                ...(result.semantic_result.matched_skills?.length > 0 
                    ? result.semantic_result.matched_skills.map((skill: string) => ` ${skill}`)
                    : ["No matched skills found"]),
                "",
                `❌ Missing Skills (${result.semantic_result.missing_skills?.length || 0}):`,
                ...(result.semantic_result.missing_skills?.length > 0
                    ? result.semantic_result.missing_skills.map((skill: string) => ` Consider adding ${skill}`)
                    : ["No missing skills - Great job!"])
            ] : ["Upload resume and job description to see skill analysis"]
        },
        {
            id: "improve",
            title: "Resume Improvements",
            description: "Get actionable suggestions to enhance your resume",
            icon: "🚀",
            content: result && result.semantic_result ? [
                `📊 Overall Match Score: ${result.semantic_result.overall_match_score}%`,
                `🧠 Semantic Score: ${result.semantic_result.semantic_score}%`,
                `💼 Skill Score: ${result.semantic_result.skill_score}%`,
                `📋 ATS Score: ${result.semantic_result.ats_score}%`,
                "",
                result.semantic_result.matched_skills?.length > 0 
                    ? `✨ Your Strengths: ${result.semantic_result.matched_skills.join(', ')}`
                    : "Focus on highlighting your key skills",
                result.semantic_result.missing_skills?.length > 0
                    ? `🎯 Areas to Improve: ${result.semantic_result.missing_skills.join(', ')}`
                    : ""
            ] : ["Upload resume and job description to see detailed analysis"]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Navigation */}
            <Navigation />
            {/* Background Doodles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-300 rounded-full opacity-20 transform rotate-12"></div>
                <div className="absolute top-40 right-20 w-16 h-16 border-2 border-purple-300 rounded-lg opacity-15 transform -rotate-6"></div>
                <div className="absolute bottom-20 left-20 w-24 h-12 border-2 border-green-300 rounded-full opacity-10 transform rotate-45"></div>
                <div className="absolute top-60 left-40 w-12 h-12 border-2 border-yellow-300 rounded opacity-25"></div>
                <div className="absolute bottom-40 right-10 w-32 h-8 border-2 border-pink-300 rounded-full opacity-20 transform -rotate-12"></div>
                <div className="absolute top-80 right-40 w-8 h-8 bg-blue-200 rounded-full opacity-10"></div>
                <div className="absolute bottom-60 left-60 w-16 h-16 border-2 border-indigo-300 transform rotate-45 opacity-15"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row h-screen">
                {/* Left Sidebar - Sketchy Paper Style */}
                <div className="lg:w-96 bg-white shadow-2xl border-r-4 border-gray-200 p-6 lg:p-8 relative">
                    {/* Paper Texture Background */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="h-full w-full" style={{ 
                            backgroundImage: `repeating-linear-gradient(
                                0deg,
                                transparent,
                                transparent 2px,
                                rgba(0,0,0,0.03) 2px,
                                rgba(0,0,0,0.03) 4px
                            )`
                        }}></div>
                    </div>
                    
                    {/* Resume Score Loader - Sketchy Style */}
                    <div className="relative flex flex-col items-center mb-8">
                        <div className="relative">
                            <div className="w-40 h-40 border-4 border-gray-800 rounded-full relative overflow-hidden shadow-lg">
                                {/* Sketchy circle effect */}
                                <div className="absolute inset-0 border-2 border-gray-600 rounded-full transform scale-95"></div>
                                
                                {/* Progress arc */}
                                <div 
                                    className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 transform -rotate-45 transition-all duration-1000 ease-out"
                                    style={{
                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((resumeScore || 0) - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((resumeScore || 0) - 90) * Math.PI / 180)}%, 50% 50%)`
                                    }}
                                ></div>
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-gray-800">{resumeScore || 0}%</span>
                                      
                                    </div>
                                </div>
                            </div>
                            
                            {/* Doodle elements around score */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-yellow-400 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-2 border-green-400 transform rotate-45"></div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mt-4 relative">
                            <span className="relative">
                                Resume Score
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 transform -skew-x-12"></div>
                            </span>
                        </h3>
                        
                        {/* Score status with sketchy badge */}
                        {resumeScore && (
                            <div className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-gray-800 rounded-lg transform -rotate-1 shadow-md">
                                <span className={`font-bold ${
                                    resumeScore >= 80 ? 'text-green-700' : 
                                    resumeScore >= 60 ? 'text-yellow-700' : 'text-red-700'
                                }`}>
                                    {resumeScore >= 80 ? '🌟 Excellent' : 
                                     resumeScore >= 60 ? '👍 Good' : '⚡ Needs Work'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Navigation Items - Sketchy Button Style */}
                    <nav className="space-y-3">
                        {analysisCards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => setActiveSection(card.id)}
                                className={`group relative w-full text-left p-4 border-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                    activeSection === card.id 
                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 -rotate-1' 
                                        : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
                                }`}
                            >
                                {/* Sketchy button effect */}
                                <div className="absolute inset-0 border border-gray-400 rounded-lg transform scale-105 pointer-events-none"></div>
                                
                                <div className="relative flex items-center space-x-3">
                                    <span className="text-2xl transform group-hover:scale-110 transition-transform">{card.icon}</span>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800 capitalize block">
                                            {card.id.replace('-', ' ')}
                                        </span>
                                        <span className="text-xs text-gray-600">{card.description}</span>
                                    </div>
                                </div>
                                
                                {/* Doodle on active */}
                                {activeSection === card.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 lg:p-8 p-4 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* Mobile Resume Score Display */}
                        <div className="lg:hidden mb-6 flex flex-col items-center bg-white rounded-lg p-6 shadow-xl border-2 border-gray-200">
                            <div className="relative w-24 h-24 mb-3">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                                <div 
                                    className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent border-r-transparent transform -rotate-45"
                                    style={{
                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((resumeScore || 0) - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((resumeScore || 0) - 90) * Math.PI / 180)}%, 50% 50%)`
                                    }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-800">{resumeScore || 0}%</span>
                                </div>
                            </div>
                            <h3 className="text-base font-semibold text-gray-800">Resume Score</h3>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="lg:hidden mb-6">
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {analysisCards.map((card) => (
                                    <button
                                        key={card.id}
                                        onClick={() => setActiveSection(card.id)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
                                            activeSection === card.id 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">{card.icon}</span>
                                            <span className="text-sm font-medium capitalize">{card.id.replace('-', ' ')}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Section - Sketchy Paper Style */}
                        <div className="mb-8 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 lg:p-6 relative">
                            {/* Paper texture overlay */}
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
                                <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-gray-800 relative">
                                    <span className="relative">
                                        Resume Analysis
                                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-800 transform -skew-x-12"></div>
                                    </span>
                                </h1>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Resume Text</label>
                                        <div className="mb-2 text-xs text-gray-500">
                                            {resumeText ? '✓ Resume loaded from upload' : '📝 Upload resume on home page to auto-fetch, or paste text below'}
                                        </div>
                                        <textarea
                                            value={resumeText}
                                            onChange={(e) => setResumeText(e.target.value)}
                                            className="w-full h-32 p-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm lg:text-base shadow-inner"
                                            placeholder="Paste your resume text here or upload on home page to auto-fetch..."
                                        />
                                        {resumeScore && (
                                            <div className="mt-2 text-sm text-green-600 font-medium">
                                                ✓ Resume Score: {resumeScore}%
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Job Description</label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            className="w-full h-32 p-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm lg:text-base shadow-inner"
                                            placeholder="Paste job description here..."
                                        />
                                    </div>
                                </div>

                                {/* Analyze Button - Sketchy Style */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100"
                                    >
                                        {/* Button sketchy effect */}
                                        <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                        
                                        <span className="relative">
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <span className="mr-2">⏳</span>
                                                    Analyzing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <span className="mr-2">🔍</span>
                                                    Analyze Match
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Cards - Sketchy Paper Style */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {analysisCards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`bg-white rounded-lg shadow-xl border-2 border-gray-200 p-6 relative transition-all duration-300 hover:shadow-2xl hover:scale-102 ${
                                        activeSection === card.id ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                                    }`}
                                >
                                    {/* Card paper texture */}
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
                                        {/* Card header with doodle */}
                                        <div className="flex items-center mb-4">
                                            <span className="text-3xl mr-3">{card.icon}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                                                <p className="text-xs text-gray-600">{card.description}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Doodle element */}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-yellow-300 rounded-full transform rotate-12 opacity-60"></div>
                                        
                                        {/* Card content */}
                                        <div className="text-sm text-gray-700 space-y-1">
                                            {Array.isArray(card.content) ? (
                                                card.content.map((item, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <span className="text-gray-500 mr-2">{item.startsWith('•') || item.startsWith('✅') || item.startsWith('❌') || item.startsWith('📊') || item.startsWith('🧠') || item.startsWith('💼') || item.startsWith('📋') || item.startsWith('✨') || item.startsWith('🎯') ? '' : '•'}</span>
                                                        <span className="flex-1">{item.replace(/^[•✅❌📊🧠💼📋✨🎯]\s*/, '')}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-600 italic">{card.content}</div>
                                            )}
                                        </div>

                                        {/* View Details Button */}
                                        {result && activeSection === card.id && (
                                            <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors text-sm font-medium shadow-md">
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
