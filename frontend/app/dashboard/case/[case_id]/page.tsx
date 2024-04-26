"use client";

import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { FaCheck, FaTimes, FaSpinner, FaAngleDown, FaAngleRight, FaPlus, FaMinus } from "react-icons/fa";

export default function CasePage() {
    const pathname = usePathname();
    const pathParts = pathname.split('/').filter(part => part !== '');
    const case_id = pathParts.pop();

    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [stepsLoading, setStepsLoading] = useState(true);
    const [caseData, setCaseData] = useState(null);
    const [error, setError] = useState(null);
    const [openSteps, setOpenSteps] = useState({});
    const [openEvidence, setOpenEvidence] = useState({});
    const [timeSinceCreated, setTimeSinceCreated] = useState('');

    const toggleStep = index => {
        setOpenSteps(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleEvidence = (stepIndex, evidenceIndex) => {
        setOpenEvidence(prev => ({
            ...prev,
            [stepIndex]: {
                ...prev[stepIndex],
                [evidenceIndex]: !prev[stepIndex]?.[evidenceIndex]
            }
        }));
    };

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
        if ((seconds > 0 && parts.length === 0)) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

        return parts.join(', ');
    };

    function updateTimeSinceCreated() {
        if (caseData && caseData.created_at) {
            const now = new Date();
            const createdTime = new Date(caseData.created_at * 1000); // Assuming created_at is a Unix timestamp in seconds
            const seconds = Math.floor((now - createdTime) / 1000);
            setTimeSinceCreated(formatDuration(seconds));
        }
    }

    // This effect will reload the page every 5 seconds until the summary and steps taken have loaded
    useEffect(() => {
        let intervalId;

        async function fetchCaseData(case_id) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/cases/${case_id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch case data: ${response.statusText}`);
                }
                const data = await response.json();
                setCaseData(data);
                setSummaryLoading(!data.summary);
                setStepsLoading(!data.steps || data.steps.length === 0);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch case data:", error);
                setError(error.message);
            } finally {
                if (!summaryLoading && !stepsLoading) {
                    clearInterval(intervalId);
                }
            }
        }

        if (case_id) {
            fetchCaseData(case_id);
            intervalId = setInterval(() => fetchCaseData(case_id), 5000);
        }
        return () => clearInterval(intervalId);
    }, [case_id, summaryLoading, stepsLoading]);


    // This effect will update the "Time Since Created" value once every second
    useEffect(() => {
        const interval = setInterval(updateTimeSinceCreated, 1000);
        updateTimeSinceCreated();
        return () => clearInterval(interval);
    }, [caseData]);

    return (
        <div className="case-container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : caseData ? (
                <div>
                    <div className="header-container">
                        <h3>Case Details</h3>
                        <div>
                            <strong>Final Determination:</strong> <span className="final-determination" style={{ color: caseData.is_met ? 'green' : 'red' }}>{caseData.is_met ? 'Met' : 'Not Met'}</span>
                        </div>
                    </div>
                    <div className="subheader-container">
                        <p>Question number sequence: {
                            caseData.steps.map(step => step.next_step).join(", ")
                        }</p>
                        <p>Status: {
                            caseData.status
                        }</p>
                    </div>
                    <p><strong>Procedure Name:</strong> {caseData.procedure_name || "Not specified"}</p>
                    <p><strong>CPT Codes:</strong> {caseData.cpt_codes ? caseData.cpt_codes.join(', ') : "Not provided"}</p>
                    <div><strong>Summary:</strong> {summaryLoading ? <FaSpinner className="animate-spin" /> : caseData.summary || "No summary available."}</div>
                    <p><strong>Time Since Created:</strong> {caseData.created_at ? formatDuration(Math.floor((new Date() - new Date(caseData.created_at * 1000)) / 1000)) + " ago" : "Time unavailable"}</p>
                    <div>
                        <strong>Steps Taken:</strong>
                        {stepsLoading ? <FaSpinner className="animate-spin" /> : (
                            <div>
                                {caseData.steps.map((step, index) => (
                                    <div key={index} className="step-section">
                                        <button onClick={() => toggleStep(index)} className="collapse-toggle">
                                            {step.question}
                                            {openSteps[index] ? <FaAngleDown /> : <FaAngleRight />}
                                        </button>
                                        {openSteps[index] && (
                                            <div className="collapse-content">
                                                <ul>
                                                    {step.options.map((option, optIndex) => (
                                                        <li key={optIndex} className="option-item">
                                                            {option.selected ? <FaCheck className="icon-check" /> : <FaTimes className="icon-times" />}
                                                            <span className="option-text">({option.key}) {option.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p>{step.reasoning}</p>
                                                <button onClick={() => toggleEvidence(index, 'evidence')} className="collapse-toggle evidence-toggle">
                                                    Citations of evidence from the medical record
                                                    {openEvidence[index]?.evidence ? <FaMinus className="icon-toggle" /> : <FaPlus className="icon-toggle" />}
                                                </button>
                                                {openEvidence[index]?.evidence && (
                                                    <table className="evidence-table">
                                                        <tbody>
                                                            {step.evidence.map((evidence, eIndex) => (
                                                                <tr key={eIndex}>
                                                                    <td>
                                                                        <div className="page-number-container">
                                                                            Page {evidence.page_number || "N/A"}
                                                                        </div>
                                                                    </td>
                                                                    <td>{evidence.content}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Case data not available or not loaded yet.</p>
            )}
        </div>
    );
}
