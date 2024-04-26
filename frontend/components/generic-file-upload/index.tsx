"use client";

import { useState } from 'react';
import { useDashboard } from "@/context/dashboard-context";
import classNames from "classnames";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { SIMULATED_FILE_UPLOAD_DURATION_MILLIS } from 'resources/constants';

// A generic file upload button that simulates a 3 second long file upload
function FileUploadButton({ file, setFile, fileUrl, buttonColor, buttonText, isEnabled, onClickOverride }) {
	const [loading, setLoading] = useState(false);

	const handleClick = () => {
        if(!isEnabled) {
            return;
        }
		setLoading(true);
		setTimeout(() => {
			setFile({ url: fileUrl });
			setLoading(false);
		}, SIMULATED_FILE_UPLOAD_DURATION_MILLIS);
	}

	return (
		<div className="w-1/2 h-64 border border-4 border-gray-200 border-dashed rounded flex flex-row items-center justify-center">
			<button
				className={classNames(
					"text-white font-medium py-2 px-4 rounded border border-2",
					file === null ? `${isEnabled ? buttonColor : "bg-gray-400"} border-${isEnabled ? buttonColor : "bg-gray-400"}` : "border-transparent text-green-600",
				)}
				onClick={onClickOverride ? onClickOverride : handleClick}
				disabled={loading || !isEnabled || file !== null}
			>
				{loading ? (
					<div className="flex flex-row gap-1 items-center">
						<FaSpinner className="animate-spin" />
						<span>Uploading...</span>
					</div>
				) : file === null ? (
					<span>{buttonText} Upload</span>
				) : (
					<span className="text-green-600 flex flex-row gap-1 items-center">
						<FaCheck />
						<span>File Uploaded</span>
					</span>
				)}
			</button>
		</div>
	)
}

export default FileUploadButton;
