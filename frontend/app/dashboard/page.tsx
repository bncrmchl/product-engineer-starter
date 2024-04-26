"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { DashboardContext } from "@/context/dashboard-context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileUploadButton from "@/components/generic-file-upload";
import { API_HOST, SIMULATED_CASE_DATA } from "@/resources/constants";

// This page allows the user to upload their case documents and submit them for processing
export default function DashboardRoot() {
	const router = useRouter();
	const { guidelinesFile, medicalRecord, setGuidelinesFile, setMedicalRecord } = useContext(DashboardContext);
	const isContinueButtonDisabled = !guidelinesFile || !medicalRecord;

    // This function handles submitting the case data and loads the case detail view
	const handleContinue = async () => {

        // Display a toast error message if both documents haven't been uploaded
        displayNotificationIfNecessary()

        // If both files are present, POST to create a new Case, then load the case detail view
        if(guidelinesFile && medicalRecord) {
            const response = await fetch(`${API_HOST}/cases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(SIMULATED_CASE_DATA)
            });

            if (!response.ok) {
                throw new Error('Failed to create case');
            }

            const responseData = await response.json();
            const caseId = responseData;

            if (!caseId) {
                throw new Error("Case ID was not returned from the server.");
            }

            router.push(`/dashboard/case/${caseId}`);
        }
	};

    // This function displays an appropriate error notification depending on which files have been uplaoded
    const displayNotificationIfNecessary = () => {
        if (!guidelinesFile && !medicalRecord) {
            toast.error("Please upload Both Documents to proceed, starting with the medical record.");
        } else if (guidelinesFile && !medicalRecord) {
            toast.error("Please upload your medical record to proceed.");
        } else if (!guidelinesFile && medicalRecord) {
            toast.error("Please upload your guidelines file to proceed.");
        }
    };

    // The properties to use for the file upload buttons
	const guidelinesFileUploadButtonProperties = {
		file: guidelinesFile,
		setFile: setGuidelinesFile,
		fileUrl: "/assets/guidelines.pdf",
		buttonColor: medicalRecord ? "bg-orange-500" : "bg-gray-400",
		buttonText: "Simulate Guidelines"
	};
	const medicalRecordFileUploadButtonProperties = {
		file: medicalRecord,
		setFile: setMedicalRecord,
		fileUrl: "/assets/medical-record.pdf",
		buttonColor: "bg-blue-500",
		buttonText: "Simulate Medical Record"
	};

    // The page structure
	return (
		<>
		<ToastContainer />
		<div className="w-full flex flex-col justify-center items-center h-screen">
			<div className="w-full flex flex-row gap-2 items-center">
				<FileUploadButton
					{...medicalRecordFileUploadButtonProperties}
					isEnabled={true}
				/>
                <FileUploadButton
                    {...guidelinesFileUploadButtonProperties}
                    isEnabled={true}
                    onClickOverride={medicalRecord ? undefined : displayNotificationIfNecessary}
                />
			</div>
			<div className="w-full py-4 flex flex-row justify-center">
				<button
					className={`font-medium text-white py-2 px-4 rounded ${isContinueButtonDisabled ? "bg-gray-400" : "bg-green-600"} border-${isContinueButtonDisabled ? "bg-gray-400" : "bg-green-600"} border-2`}
					onClick={handleContinue}
				>
					{isContinueButtonDisabled ? "Please upload all required files to continue..." : "Continue"}
				</button>
			</div>
		</div>
		</>
	);
}
