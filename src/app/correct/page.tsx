"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";

interface ResumeMistake {
    id: string;
    type: "ats_issue" | "missing_skill" | "improvement" | "formatting";
    severity: "high" | "medium" | "low";
    original_text: string;
    suggested_text: string;
    description: string;
    section: string;
    corrected: boolean;
}

export default function CorrectPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [mistakes, setMistakes] = useState<ResumeMistake[]>([]);
    const [loading, setLoading] = useState(false);
    const [correctedResume, setCorrectedResume] = useState("");
    const [showComparison, setShowComparison] = useState(true);

    useEffect(() => {
        const savedResumeText = localStorage.getItem('resumeText') || sessionStorage.getItem('resumeText');
        const savedJobDescription = sessionStorage.getItem('jobDescription');
        
        if (savedResumeText) setResumeText(savedResumeText);
        if (savedJobDescription) setJobDescription(savedJobDescription);
    }, []);

    const analyzeResume = async () => {
        if (!resumeText || !jobDescription) return;
        
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8001/jd/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resume_text: resumeText,
                    job_description: jobDescription
                }),
            });
            const data = await res.json();
            
            const parsedMistakes = parseMistakes(resumeText, data);
            setMistakes(parsedMistakes);
            generateCorrectedResume(parsedMistakes);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const parseMistakes = (text: string, analysisData: any): ResumeMistake[] => {
        const mistakes: ResumeMistake[] = [];
        let id = 0;

        if (analysisData.semantic_result?.ats_issues) {
            analysisData.semantic_result.ats_issues.forEach((issue: string) => {
                mistakes.push({
                    id: `ats-${id++}`,
                    type: "ats_issue",
                    severity: "high",
                    original_text: "Resume content",
                    suggested_text: `✨ ${issue}`,
                    description: "ATS optimization needed",
                    section: "General",
                    corrected: false
                });
            });
        }

        if (analysisData.semantic_result?.missing_skills) {
            analysisData.semantic_result.missing_skills.forEach((skill: string) => {
                mistakes.push({
                    id: `skill-${id++}`,
                    type: "missing_skill",
                    severity: "medium",
                    original_text: "Skills section",
                    suggested_text: `Consider adding: ${skill}`,
                    description: "Missing key skill for this role",
                    section: "Skills",
                    corrected: false
                });
            });
        }

        if (analysisData.semantic_result?.improvements) {
            analysisData.semantic_result.improvements.forEach((improvement: string) => {
                mistakes.push({
                    id: `improvement-${id++}`,
                    type: "improvement",
                    severity: "medium",
                    original_text: "Resume content",
                    suggested_text: `🎯 ${improvement}`,
                    description: "Resume improvement suggestion",
                    section: "Content",
                    corrected: false
                });
            });
        }

        return mistakes;
    };

    const generateCorrectedResume = (currentMistakes: ResumeMistake[]) => {
        let corrected = resumeText;
        
        const missingSkills = currentMistakes
            .filter(m => m.type === "missing_skill" && m.corrected)
            .map(m => m.suggested_text.replace("Consider adding: ", ""));
        
        if (missingSkills.length > 0) {
            if (corrected.toLowerCase().includes("skills")) {
                corrected += "\n" + missingSkills.join('\n');
            } else {
                corrected += "\n\nSKILLS\n" + missingSkills.join('\n');
            }
        }
        
        setCorrectedResume(corrected);
    };

    const toggleMistake = (mistakeId: string) => {
        setMistakes(prev => {
            const updated = prev.map(m => 
                m.id === mistakeId ? {...m, corrected: !m.corrected} : m
            );
            generateCorrectedResume(updated);
            return updated;
        });
    };

    const applyAllCorrections = () => {
        setMistakes(prev => {
            const updated = prev.map(m => ({...m, corrected: true}));
            generateCorrectedResume(updated);
            return updated;
        });
    };

    const downloadResume = (format: 'txt' | 'pdf') => {
        if (format === 'txt') {
            const blob = new Blob([correctedResume], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'corrected_resume.txt';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const pdfContent = `
RESUME - CORRECTED VERSION
========================

${correctedResume}

Generated on: ${new Date().toLocaleDateString()}
ResumeAI Correction Tool
            `.trim();
            
            const blob = new Blob([pdfContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'corrected_resume.pdf';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'high': return 'bg-red-100 border-red-300 text-red-800';
            case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'low': return 'bg-green-100 border-green-300 text-green-800';
            default: return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'ats_issue': return '⚠️';
            case 'missing_skill': return '📚';
            case 'improvement': return '✨';
            case 'formatting': return '📝';
            default: return '📋';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            <Navigation />
            <div className="relative z-10 flex-1 p-4 lg:p-8 pt-20">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 relative">
                        <span className="relative">
                            Resume Correction Center
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 transform -skew-x-12"></div>
                        </span>
                    </h1>

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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Resume Text</label>
                                    <textarea
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                        className="w-full h-32 p-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-inner"
                                        placeholder="Paste your resume text here..."
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Job Description</label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="w-full h-32 p-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-inner"
                                        placeholder="Paste job description here..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={analyzeResume}
                                disabled={loading || !resumeText || !jobDescription}
                                className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:scale-100"
                            >
                                <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                <span className="relative">
                                    {loading ? (
                                        <span className="flex items-center">
                                            <span className="mr-2">⏳</span>
                                            Analyzing Resume...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <span className="mr-2">🔍</span>
                                            Analyze & Find Mistakes
                                        </span>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    {mistakes.length > 0 && (
                        <>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">{mistakes.filter(m => m.severity === 'high').length}</div>
                                    <div className="text-sm text-gray-600">High Priority</div>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{mistakes.filter(m => m.severity === 'medium').length}</div>
                                    <div className="text-sm text-gray-600">Medium Priority</div>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{mistakes.filter(m => m.severity === 'low').length}</div>
                                    <div className="text-sm text-gray-600">Low Priority</div>
                                </div>
                                <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{mistakes.filter(m => m.corrected).length}/{mistakes.length}</div>
                                    <div className="text-sm text-gray-600">Corrected</div>
                                </div>
                            </div>

                            <div className="mb-6 flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={applyAllCorrections}
                                    className="relative px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                    <span className="relative">
                                        <span className="flex items-center">
                                            <span className="mr-2">✅</span>
                                            Apply All Corrections
                                        </span>
                                    </span>
                                </button>
                                
                                <button
                                    onClick={() => setShowComparison(!showComparison)}
                                    className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                    <span className="relative">
                                        <span className="flex items-center">
                                            <span className="mr-2">👁️</span>
                                            {showComparison ? 'Hide' : 'Show'} Comparison
                                        </span>
                                    </span>
                                </button>
                            </div>

                            <div className="mb-8 space-y-4">
                                {mistakes.map((mistake) => (
                                    <div key={mistake.id} className={`bg-white rounded-lg shadow-xl border-2 border-gray-200 p-6 relative ${mistake.corrected ? 'opacity-75' : ''}`}>
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
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{getTypeIcon(mistake.type)}</span>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-800">{mistake.description}</h3>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(mistake.severity)}`}>
                                                                {mistake.severity.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-gray-500">{mistake.section}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <button
                                                    onClick={() => toggleMistake(mistake.id)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        mistake.corrected 
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    }`}
                                                >
                                                    {mistake.corrected ? '✅ Corrected' : '🔧 Fix This'}
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 text-gray-700">Original</label>
                                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <p className="text-sm text-gray-700">{mistake.original_text}</p>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium mb-2 text-gray-700">Suggested</label>
                                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <p className="text-sm text-gray-700">{mistake.suggested_text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 p-6 relative">
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
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Download Corrected Resume</h2>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button
                                            onClick={() => downloadResume('txt')}
                                            className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                            <span className="relative">
                                                <span className="flex items-center">
                                                    <span className="mr-2">📄</span>
                                                    Download as TXT
                                                </span>
                                            </span>
                                        </button>
                                        
                                        <button
                                            onClick={() => downloadResume('pdf')}
                                            className="relative px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg transform -rotate-1 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 border-2 border-gray-800 rounded-lg transform scale-105 pointer-events-none"></div>
                                            <span className="relative">
                                                <span className="flex items-center">
                                                    <span className="mr-2">📋</span>
                                                    Download as PDF
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
