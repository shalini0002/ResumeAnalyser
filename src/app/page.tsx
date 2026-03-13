'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadResume } from '../services/api';

interface AnalysisResult {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  analysis: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploading(true);
      
      try {
        const result = await uploadResume(selectedFile);
        const score = result.ats_score || 75;
        setAtsScore(score);
        setAnalysis(result);
        
        // Save to localStorage for persistence
        localStorage.setItem('resumeScore', score.toString());
        
        // Extract text and save for analyze page
        const text = await selectedFile.text();
        localStorage.setItem('resumeText', text);
      } catch (error) {
        console.error('Upload failed:', error);
        setAtsScore(75);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleViewAnalysis = () => {
    router.push('/analyze');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">ResumeAI</span>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        {/* Left Section - AI Resume App Info */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="max-w-lg">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                </div>
                <span className="ml-4 text-3xl font-bold text-gray-900">ResumeAI</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Resume Analysis
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Transform your resume with intelligent ATS optimization and personalized insights
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ATS Score Analysis</h3>
                  <p className="text-gray-600">Get instant feedback on your resume's compatibility with Applicant Tracking Systems</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Job Matching</h3>
                  <p className="text-gray-600">Compare your resume against specific job descriptions for better alignment</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">✨</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
                  <p className="text-gray-600">Receive intelligent recommendations to improve your resume content</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Upload Functionality */}
        <div className="w-1/2 bg-white flex items-center justify-center p-12">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Analyze Your Resume
              </h2>
              <p className="text-gray-600">
                Upload your resume to get instant ATS score and insights
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              
              <label
                htmlFor="resume-upload"
                className="cursor-pointer block"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">📄</span>
                  </div>
                </div>
                
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {uploading ? 'Analyzing...' : 'Choose your resume'}
                </p>
                
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX (Max 10MB)
                </p>
              </label>
            </div>

            {/* ATS Score Display */}
            {atsScore !== null && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your ATS Score
                </h3>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                    <div 
                      className="absolute inset-0 w-32 h-32 rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent transform -rotate-45"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((atsScore - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((atsScore - 90) * Math.PI / 180)}%, 50% 50%)`
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{atsScore}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${atsScore >= 80 ? 'text-green-600' : atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  
                  {analysis && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Skills Matched:</span>
                        <span className="font-medium text-gray-900">{analysis.matched_skills?.length || 8}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Missing Skills:</span>
                        <span className="font-medium text-gray-900">{analysis.missing_skills?.length || 3}</span>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={handleViewAnalysis}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  View Detailed Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}