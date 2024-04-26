"use client";

// pages/dashboard/case/[case_id]/page.tsx
import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";

export default function CasePage() {

    // Extract the case ID from the URL here. This solution should account for trailing slashes as well.
    const pathname = usePathname();
    const pathParts = pathname.split('/').filter(part => part !== '');
    const case_id = pathParts.pop();

    //set up states
    const [loading, setLoading] = useState(true);
    const [caseData, setCaseData] = useState(null);
    const [error, setError] = useState(false);

    //This function takes a duration in seconds, and formats it into a more human-readable format
    //(ex "2 hours, 10 minutes, 5 seconds" instead of "7200 seconds")
    function formatDuration(seconds) {
        const days = Math.floor(seconds / (24*60*60));
        seconds %= 86400;
        const hours = Math.floor(seconds / (60*60));
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        const parts = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

        return parts.join(', ');
    }

    // Fetch case data based on case_id
    useEffect(() => {
        async function fetchCaseData(case_id) {
            try {
                // TODO store hostnames in an environment file?
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

    //Render the page
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : caseData ? (
                <div>
                    <h3>Case Details</h3>
                    {caseData && (
                        <>
                            <p><strong>Procedure Name:</strong> {caseData.procedure_name}</p>
                            <p><strong>CPT Codes:</strong> {caseData.cpt_codes.join(', ')}</p>
                            <p><strong>Summary:</strong> {caseData.summary}</p>
                            <p><strong>Time Since Created:</strong> {
                                formatDuration(
                                    Math.floor((new Date() - new Date(caseData.created_at * 1000)) / 1000)
                                )
                            } ago</p>
                            <p><strong>Steps Taken:</strong></p>
                            <ul>
                                {caseData.steps.map((step, index) => (
                                    <li key={index}>{step.question}</li>
                                ))}
                            </ul>
                            <p><strong>Final Determination:</strong> {caseData.is_met ? 'Met' : 'Not Met'}</p>
                        </>
                    )}
                </div>
            ) : (
                <p>Case data not available or not loaded yet.</p>
            )}
        </div>
    );

}