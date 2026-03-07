"use client"

import { useState } from "react";
import { uploadResume } from "../../services/api";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleUpload = async () => {
        if (!file) return;
        
        const data = await uploadResume(file);
        setResult(data);
        
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
            {result && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}