export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export function GetUserDisplayName(username, full_name) {
    let display_name = "";
    if (full_name) {
        display_name = full_name;
    } else {
        display_name = username;
    }

    return display_name;
}

export function GetUserInitials(display_name) {
    let initials = display_name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
    initials = initials.join('');
    initials = initials.toUpperCase();

    return initials;
}

export function epochToJsDate(ts) {
    let dt = new Date(ts)
    return dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
}