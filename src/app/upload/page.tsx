"use client";

import { useState } from "react";
import { uploadResume } from "../../services/api";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        
        setLoading(true);
        try {
            const data = await uploadResume(file);
            setResult(data);
            setShowSuccess(true);
            
            // Hide success message after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
            
            <div className="space-y-4">
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                <button 
                    onClick={handleUpload} 
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </div>
            
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Resume submitted successfully!
                    </div>
                </div>
            )}
            
            {/* Show parsed resume info instead of full JSON */}
            {result && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Resume Parsed Successfully</h2>
                    
                    <div className="space-y-3">
                        <div>
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="ml-2 text-gray-900">{result.ai_parsed_resume?.name || 'N/A'}</span>
                        </div>
                        
                        <div>
                            <span className="font-medium text-gray-700">Role:</span>
                            <span className="ml-2 text-gray-900">{result.ai_parsed_resume?.role || 'N/A'}</span>
                        </div>
                        
                        <div>
                            <span className="font-medium text-gray-700">Skills Found:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {result.ai_parsed_resume?.skills?.map((skill: string, index: number) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {skill}
                                    </span>
                                )) || <span className="text-gray-500">No skills found</span>}
                            </div>
                        </div>
                        
                        <div>
                            <span className="font-medium text-gray-700">File:</span>
                            <span className="ml-2 text-gray-900">{result.filename}</span>
                        </div>
                        
                        <div>
                            <span className="font-medium text-gray-700">Size:</span>
                            <span className="ml-2 text-gray-900">{Math.round(result.size_in_bytes / 1024)} KB</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}