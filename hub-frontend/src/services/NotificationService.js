import React, { useState, useEffect, useContext, useReducer, createContext } from "react";

// Create a Notification Context
const NotificationContext = createContext();

// Hook for child components
export const useNotificationContext = () => {
    return useContext(NotificationContext);
};

// Setup Notification Reducer
let initialState = {
    displayAlert: false,
    messages: [],
    message: "",
    severity: "error",
};
const reducer = (state, action) => {
    switch (action.type) {
        case "DISPLAY_ALERT":
            console.log(state)
            return {
                ...state,
                displayAlert: true,
                message: action.payload.message,
                severity: action.payload.severity == null ? "error" : action.payload.severity
            };
        case "HIDE_ALERT":
            return {
                ...state,
                displayAlert: false,
                message: ""
            };
        default:
            return state;
    }
};

// Enum Context Provider 
export function NotificationContextProvider({ children }) {

    // Auth Reducer
    const [state, dispatch] = useReducer(reducer, initialState);

    // Setup Provider
    useEffect(() => {

    }, []);

    return <NotificationContext.Provider value={{ state, dispatch }}>{children}</NotificationContext.Provider>;
}