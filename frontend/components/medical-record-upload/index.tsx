"use client";

import { useState } from 'react';
import { useDashboard } from "@/context/dashboard-context";
import classNames from "classnames";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { SIMULATED_FILE_UPLOAD_DURATION_MILLIS } from 'resources/constants';

export default function MedicalRecordUpload() {
    const { medicalRecord, setMedicalRecord } = useDashboard();
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setMedicalRecord({ url: "/assets/medical-record.pdf" });
            setLoading(false);
        }, SIMULATED_FILE_UPLOAD_DURATION_MILLIS);
    }

    return(
        <div className="w-1/2 h-64 border border-4 border-gray-200 border-dashed rounded flex flex-row items-center justify-center">
            <button
                className={classNames(
                    "text-white font-medium py-2 px-4 rounded border border-2",
                    medicalRecord === null ? "bg-blue-500 border-blue-500" : "border-transparent text-green-600" 
                )}
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? (
                    <div className="flex flex-row gap-1 items-center">
                        <FaSpinner className="animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : medicalRecord === null ? (
                    <span>Simulate Medical Record Upload</span>
                ) : (
                    <span className="text-green-600 flex flex-row gap-1 items-center">
                        <FaCheck />
                        <span>Medical Record Uploaded</span>
                    </span>
                )}
            </button>
        </div>
    )
}