"use client"

import { useState } from "react";

export default function MatchPage() {
    const[jd, setJd] = useState("");


    return (
        <div className="text-2xl font-bold mb-6">
            <h1>Resume Vs Job Description Matcher</h1>
            <textarea 
                rows={8}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full border border-gray-300 rounded-md p-4"
            />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Analyze Match</button>
        </div>
    );
}
