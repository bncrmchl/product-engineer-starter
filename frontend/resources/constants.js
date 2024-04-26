// This file contains constant values that are used throughout the frontend application in any environment (dev/prod/etc)

export const SIMULATED_FILE_UPLOAD_DURATION_MILLIS = 3000; // Use this value for the duration of the spinner we add to the simulated file upload buttons

export const SIMULATED_CASE_DATA = {
    procedure_name: "Facet Joint Injection",
    cpt_codes: [
        "64490",
        "64491",
        "64492",
        "64493",
        "64494",
        "64495"
    ],
    summary: null,
    is_met: false,
    is_complete: false,
    steps: []
};