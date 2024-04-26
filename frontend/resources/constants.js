// This file contains constant values that are used throughout the frontend application in any environment (dev/prod/etc)

export const API_HOST = "http://localhost:8000"
export const SIMULATED_FILE_UPLOAD_DURATION_MILLIS = 3000; // Use this value for the duration of the spinner we add to the simulated file upload buttons
export const CASE_DATA_REFRESH_INTERVAL_MILLIS = 5000; // Case data view refresh interval
export const TIME_UPDATE_INTERVAL_MILLIS = 1000; // time since updated refresh interval
export const SECONDS_PER_DAY = 86400;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_MINUTE = 60;
export const UNIX_TIMESTAMP_MULTIPLIER = 1000; // multiply millis by this value to get seconds
export const CASE_DATA_REFRESH_TIMEOUT_LIMIT_MILLIS = 60000; // timeout for case data view to stop auto-refreshing

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