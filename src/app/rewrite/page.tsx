"use client"

import { useState } from "react";

export default function RewritePage() {
    const [bullet, setBullet] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const rewrite = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8001/resume/rewrite-bullet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bullet),
            });
            const data = await res.json();
            setResult(data.improved_bullet);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="flex-1 p-10 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Bullet Rewriter</h1>
            <div className="max-w-2xl">
                <textarea 
                    rows={4}
                    value={bullet}
                    onChange={(e) => setBullet(e.target.value)}
                    placeholder="Paste bullet point here..."
                    className="w-full border border-gray-300 rounded-md p-4 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                    onClick={rewrite}
                    disabled={loading}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Rewriting..." : "Rewrite"}
                </button>
                {result && (
                    <div className="mt-6 p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Rewritten Bullet:</h2>
                        <p className="text-gray-700">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
