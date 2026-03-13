"use client";

import { useState, useEffect } from "react";
import { analyzeJD } from "../../services/api";

export default function AnalyzePage() {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState("rewrite");
    const [resumeScore, setResumeScore] = useState<number | null>(null);

    // Load saved resume score and text from localStorage on component mount
    useEffect(() => {
        const savedScore = localStorage.getItem('resumeScore');
        const savedResumeText = localStorage.getItem('resumeText');
        
        if (savedScore) {
            setResumeScore(parseInt(savedScore));
        }
        if (savedResumeText) {
            setResumeText(savedResumeText);
        }
    }, []);

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
            content: result?.rewrite_suggestions || "Transform your resume bullets with AI enhancements"
        },
        {
            id: "skill-gap",
            title: "Skill Gap Analysis",
            description: "Identify missing skills for target roles",
            icon: "📊",
            content: result?.skill_gap_analysis || "Compare your skills against job requirements"
        },
        {
            id: "improve",
            title: "Resume Improvements",
            description: "Get actionable suggestions to enhance your resume",
            icon: "🚀",
            content: result?.improvement_suggestions || "Optimize your resume for better ATS performance"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white lg:flex lg:h-screen">
            {/* Left Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block lg:w-80 lg:bg-gray-800 lg:p-6 lg:flex lg:flex-col">
                {/* Resume Score Loader */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                        <div 
                            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent border-r-transparent transform -rotate-45"
                            style={{
                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((resumeScore || 0) - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((resumeScore || 0) - 90) * Math.PI / 180)}%, 50% 50%)`
                            }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{resumeScore || 0}%</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold">Resume Score</h3>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-4">
                    {analysisCards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => setActiveSection(card.id)}
                            className={`w-full text-left p-4 rounded-lg transition-colors ${
                                activeSection === card.id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">{card.icon}</span>
                                <div>
                                    <div className="font-medium capitalize">{card.id.replace('-', ' ')}</div>
                                    <div className="text-xs text-gray-400">{card.description}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:p-8 p-4 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Mobile Resume Score Display */}
                    <div className="lg:hidden mb-6 flex flex-col items-center bg-gray-800 rounded-lg p-6">
                        <div className="relative w-24 h-24 mb-3">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                            <div 
                                className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent border-r-transparent transform -rotate-45"
                                style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((resumeScore || 0) - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((resumeScore || 0) - 90) * Math.PI / 180)}%, 50% 50%)`
                                }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold">{resumeScore || 0}%</span>
                            </div>
                        </div>
                        <h3 className="text-base font-semibold">Resume Score</h3>
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
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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

                    {/* Input Section */}
                    <div className="mb-8 bg-gray-800 rounded-lg p-4 lg:p-6">
                        <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Resume Analysis</h1>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Resume Text</label>
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white text-sm lg:text-base"
                                    placeholder="Paste your resume text here..."
                                />
                                {resumeScore && (
                                    <div className="mt-2 text-sm text-green-400">
                                        ✓ Resume Score: {resumeScore}%
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Job Description</label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white text-sm lg:text-base"
                                    placeholder="Paste job description here..."
                                />
                            </div>
                        </div>
                        
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full lg:w-auto bg-blue-600 text-white px-6 py-2 lg:px-8 lg:py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-600 text-sm lg:text-base"
                        >
                            {loading ? "Analyzing..." : "Analyze Match"}
                        </button>
                    </div>

                    {/* Analysis Cards - Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {analysisCards.map((card) => (
                            <div 
                                key={card.id}
                                className={`bg-gray-800 rounded-lg p-4 lg:p-6 border-2 transition-all ${
                                    activeSection === card.id 
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                                        : 'border-gray-700 hover:border-gray-600'
                                }`}
                            >
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl lg:text-3xl mr-3">{card.icon}</span>
                                    <div>
                                        <h3 className="text-base lg:text-lg font-semibold">{card.title}</h3>
                                        <p className="text-xs lg:text-sm text-gray-400">{card.description}</p>
                                    </div>
                                </div>
                                
                                <div className="text-gray-300">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-6 lg:py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {typeof card.content === 'string' ? (
                                                <p className="text-sm lg:text-base">{card.content}</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {card.content?.map((item: string, index: number) => (
                                                        <div key={index} className="flex items-start">
                                                            <span className="text-blue-400 mr-2 text-sm lg:text-base">•</span>
                                                            <span className="text-xs lg:text-sm">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {activeSection === card.id && (
                                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm lg:text-base">
                                        View Details
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
