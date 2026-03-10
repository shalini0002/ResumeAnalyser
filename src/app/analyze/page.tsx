"use client";

import { useState } from "react";
import { analyzeJD } from "../../services/api";

export default function AnalyzePage() {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!resumeText || !jobDescription) return;
        
        setLoading(true);
        try {
            const data = await analyzeJD(resumeText, jobDescription);
            setResult(data);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-10 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Job Match Analysis</h1>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Resume Text</label>
                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Paste your resume text here..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Job Description</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Paste the job description here..."
                    />
                </div>
                
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Analyzing..." : "Analyze Match"}
                </button>
            </div>
            
            {result && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Match Scores</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Overall Match:</span>
                                    <span className="font-semibold">{result.semantic_result?.overall_match_score}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Semantic Score:</span>
                                    <span className="font-semibold">{result.semantic_result?.semantic_score}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Skill Score:</span>
                                    <span className="font-semibold">{result.semantic_result?.skill_score}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ATS Score:</span>
                                    <span className="font-semibold">{result.semantic_result?.ats_score}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Skills Analysis</h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-600">Matched Skills:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {result.semantic_result?.matched_skills?.map((skill: string, index: number) => (
                                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Missing Skills:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {result.semantic_result?.missing_skills?.map((skill: string, index: number) => (
                                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {result.semantic_result?.ats_issues?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium text-gray-700 mb-2">ATS Issues</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {result.semantic_result.ats_issues.map((issue: string, index: number) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}