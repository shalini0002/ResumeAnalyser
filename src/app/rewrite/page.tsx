"use client"

import { useState } from "react";

export default function RewritePage() {
    const [bullet, setBullet] = useState("");
    const [result, setResult] = useState("");

    const rewrite = async () => {
        const res = await fetch("http://127.0.0.1:8000/resume/rewrite-bullet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bullet: bullet,
            }),
        });
        const data = await res.json();
        setResult(data.result);
    }
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Resume Rewriter</h1>
            <textarea 
                rows={4}
                value={bullet}
                onChange={(e) => setBullet(e.target.value)}
                placeholder="Paste bullet point here..."
                className="w-full border border-gray-300 rounded-md p-4"
            />
            <button 
            onClick={rewrite}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Rewrite</button>
            {result && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Rewritten Bullet:</h2>
                    <p className="text-gray-700">{result}</p>
                </div>
            )}
        </div>
    );
}
