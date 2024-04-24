"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { DashboardContext } from "@/context/dashboard-context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileUploadButton from "@/components/generic-file-upload";

export default function DashboardRoot() {
	const router = useRouter();
	const { guidelinesFile, medicalRecord, setGuidelinesFile, setMedicalRecord } = useContext(DashboardContext);
	const CASE_ID = "case_891a_6fbl_87d1_4326";
	const isContinueButtonDisabled = !guidelinesFile || !medicalRecord;

	const handleContinue = () => {
		router.push(`/dashboard/case/${CASE_ID}`);
	}

	const notify = () => toast.error("Please upload the Medical Record first!");

	const guidelinesFileUploadButtonProperties = {
		file: guidelinesFile,
		setFile: setGuidelinesFile,
		fileUrl: "/assets/guidelines.pdf",
		buttonColor: "bg-orange-500",
		buttonText: "Simulate Guidelines"
	};

	const medicalRecordFileUploadButtonProperties = {
		file: medicalRecord,
		setFile: setMedicalRecord,
		fileUrl: "/assets/medical-record.pdf",
		buttonColor: "bg-blue-500",
		buttonText: "Simulate Medical Record"
	};

	return (
		<>
		<ToastContainer />
		<div className="w-full flex flex-col justify-center items-center h-screen">
			<div className="w-full flex flex-row gap-2 items-center">
				<FileUploadButton
					{...guidelinesFileUploadButtonProperties}
					isEnabled={true}
				/>
				{guidelinesFile ? (
					<FileUploadButton
						{...medicalRecordFileUploadButtonProperties}
						isEnabled={true}
					/>
				) : (
					<FileUploadButton
						{...medicalRecordFileUploadButtonProperties}
						isEnabled={false}
					/>
				)}
			</div>
			<div className="w-full py-4 flex flex-row justify-center">
				<button
					className={`font-medium text-white py-2 px-4 rounded ${isContinueButtonDisabled ? "bg-gray-400" : "bg-green-600"} border-${isContinueButtonDisabled ? "bg-gray-400" : "bg-green-600"} border-2`}
					onClick={handleContinue}
					disabled={isContinueButtonDisabled}
				>
					{isContinueButtonDisabled ? "Please upload all required files to continue..." : "Continue"}
				</button>
			</div>
		</div>
		</>
	);
}
