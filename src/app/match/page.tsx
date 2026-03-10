"use client"

import { useEffect } from "react";

export default function MatchPage() {
    useEffect(() => {
        window.location.href = "/analyze";
    }, []);

    return (
        <div className="flex-1 p-10 bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Redirecting to Job Match Analysis...</h1>
                <p>Please wait while we redirect you.</p>
            </div>
        </div>
    );
}
