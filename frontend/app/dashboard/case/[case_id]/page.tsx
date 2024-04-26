"use client";

import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { FaCheck, FaTimes, FaSpinner, FaAngleDown, FaAngleRight, FaPlus, FaMinus } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CasePage() {

    // Extract the case_id from the URL path, accounting for trailing slashes
    const case_id = usePathname().split('/').filter(part => part !== '').pop()

    // Set up states
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [stepsLoading, setStepsLoading] = useState(true);
    const [caseData, setCaseData] = useState(null);
    const [error, setError] = useState(null);
    const [openSteps, setOpenSteps] = useState({});
    const [openEvidence, setOpenEvidence] = useState({});
    const [timeSinceCreated, setTimeSinceCreated] = useState('');

    // Set up constant values
    const CASE_DATA_REFRESH_INTERVAL_MILLIS = 5000;
    const TIME_UPDATE_INTERVAL_MILLIS = 1000;
    const SECONDS_PER_DAY = 86400;
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_MINUTE = 60;
    const UNIX_TIMESTAMP_MULTIPLIER = 1000;
    const CASE_DATA_REFRESH_TIMEOUT_LIMIT_MILLIS = 60000;


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
        const days = Math.floor(seconds / SECONDS_PER_DAY);
        seconds %= SECONDS_PER_DAY;
        const hours = Math.floor(seconds / SECONDS_PER_HOUR);
        seconds %= SECONDS_PER_HOUR;
        const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
        seconds %= SECONDS_PER_MINUTE;

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
            const createdTime = new Date(caseData.created_at * UNIX_TIMESTAMP_MULTIPLIER); // Assuming created_at is a Unix timestamp in seconds
            const seconds = Math.floor((now - createdTime) / UNIX_TIMESTAMP_MULTIPLIER);
            setTimeSinceCreated(formatDuration(seconds));
        }
    }

    // This effect will reload the page every 5 seconds until the summary and steps taken have loaded
    useEffect(() => {
        let intervalId = null;
        let timeoutId = null;

        async function fetchCaseData(case_id) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/cases/${case_id}`);
                if (!response.ok) throw new Error(`Failed to fetch case data: ${response.statusText}`);
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
                    clearTimeout(timeoutId);
                }
            }
        }

        intervalId = setInterval(() => {
            fetchCaseData(case_id);
        }, CASE_DATA_REFRESH_INTERVAL_MILLIS);

        timeoutId = setTimeout(() => {
            if (loading) {
                clearInterval(intervalId);
                toast.error("Sorry, but this case record is taking longer than expected to process. Please wait a few minutes and refresh the page. If the problem persists, contact support.", {
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
        }, CASE_DATA_REFRESH_TIMEOUT_LIMIT_MILLIS);

        fetchCaseData(case_id); // Initial fetch

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [case_id, summaryLoading, stepsLoading]);


    // This effect will update the "Time Since Created" value once every second
    useEffect(() => {
        const interval = setInterval(updateTimeSinceCreated, UNIX_TIMESTAMP_MULTIPLIER);
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
                    <p><strong>Time Since Created:</strong> {caseData.created_at ? formatDuration(Math.floor((new Date() - new Date(caseData.created_at * UNIX_TIMESTAMP_MULTIPLIER)) / UNIX_TIMESTAMP_MULTIPLIER)) + " ago" : "Time unavailable"}</p>
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
            <ToastContainer />
        </div>
    );
}
