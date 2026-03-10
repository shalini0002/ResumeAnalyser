"use client";

import { useState } from "react";

export default function ImprovePage() {

  const [resume, setResume] = useState("");
  const [jd, setJD] = useState("");
  const [result, setResult] = useState("");

  const analyzeResume = async () => {

    const res = await fetch("http://127.0.0.1:8000/resume/improve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resume_text: resume,
        job_description: jd
      })
    });

    const data = await res.json();
    setResult(data.ai_suggestions || data);
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Improve Resume with AI
      </h1>

      {/* Resume Input */}

      <textarea
        className="w-full border p-4 rounded mb-4"
        rows={6}
        placeholder="Paste your resume text..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />

      {/* Job Description */}

      <textarea
        className="w-full border p-4 rounded mb-4"
        rows={6}
        placeholder="Paste job description..."
        value={jd}
        onChange={(e) => setJD(e.target.value)}
      />

      <button
        onClick={analyzeResume}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Improve Resume
      </button>

      {/* Result */}

      {result && (
        <div className="bg-white p-6 mt-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">
            AI Suggestions
          </h2>

          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}