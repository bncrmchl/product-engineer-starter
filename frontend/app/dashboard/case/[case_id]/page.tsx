"use client";

import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";

export default function CasePage() {
    const pathname = usePathname();
    const pathParts = pathname.split('/').filter(part => part !== '');
    const case_id = pathParts.pop();

    const [loading, setLoading] = useState(true);
    const [caseData, setCaseData] = useState(null);
    const [error, setError] = useState(null);

    function formatDuration(seconds) {
        const days = Math.floor(seconds / (24*60*60));
        seconds %= 86400;
        const hours = Math.floor(seconds / (60*60));
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        const parts = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

        return parts.join(', ');
    }

    useEffect(() => {
        async function fetchCaseData(case_id) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/cases/${case_id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch case data: ${response.statusText}`);
                }
                const data = await response.json();
                setCaseData(data);
            } catch (error) {
                console.error("Failed to fetch case data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (case_id) {
            fetchCaseData(case_id);
        }
    }, [case_id]);

    return (
        <div className="case-container">
            {loading ? <p>Loading...</p> :
            error ? <p>Error: {error}</p> :
            caseData ? (
                <div>
                    <h3>Case Details</h3>
                    <p><strong>Procedure Name:</strong> {caseData.procedure_name || "Not specified"}</p>
                    <p><strong>CPT Codes:</strong> {caseData.cpt_codes ? caseData.cpt_codes.join(', ') : "Not provided"}</p>
                    <p><strong>Summary:</strong> {caseData.summary || "No summary available."}</p>
                    <p><strong>Time Since Created:</strong> {caseData.created_at ? `${formatDuration(Math.floor((new Date() - new Date(caseData.created_at * 1000)) / 1000))} ago` : "Time unavailable"}</p>
                    <p><strong>Steps Taken:</strong></p>
                    {caseData.steps && caseData.steps.length > 0 ? (
                        <ul>
                            {caseData.steps.map((step, index) => (
                                <li key={index}>{step.question}</li>
                            ))}
                        </ul>
                    ) : <p>No steps recorded.</p>}
                    <p><strong>Final Determination:</strong> {caseData.is_met ? 'Met' : 'Not Met'}</p>
                </div>
            ) : <p>Case data not available or not loaded yet.</p>}
        </div>
    );
}
