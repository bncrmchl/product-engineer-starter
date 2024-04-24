"use client";

import GuidelinesUpload from "@/components/guidelines-upload";
import MedicalRecordUpload from "@/components/medical-record-upload";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { DashboardContext } from "@/context/dashboard-context";

export const revalidate = 0;

export default function DashboardRoot() {
	const router = useRouter();
	const { guidelinesFile, medicalRecord } = useContext(DashboardContext);
	const CASE_ID = "case_891a_6fbl_87d1_4326";
    const isContinueButtonDisabled = !guidelinesFile || !medicalRecord;
	const handleContinue = () => {
		router.push(`/dashboard/case/${CASE_ID}`)
	}

	return (
		<div className="w-full flex flex-col justify-center items-center h-screen">
			<div className="w-full flex flex-row gap-2 items-center">
				<MedicalRecordUpload />
				<GuidelinesUpload />
			</div>
			<div className="w-full py-4 flex flex-row justify-center">
				<button
					className={`font-medium text-white py-2 px-4 rounded ${isContinueButtonDisabled ? "bg-gray-400" : "bg-green-600"}`}
					onClick={handleContinue}
					disabled={isContinueButtonDisabled}
				>
					{isContinueButtonDisabled ? "Please upload all required files to continue..." : "Continue"}
				</button>
			</div>
		</div>
	)
}
