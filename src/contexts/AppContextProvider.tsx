import React from "react";
import { ApprovalProvider } from "@/contexts/ApprovalContext";
import { AttendanceProvider } from "./AttendanceContext";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <AttendanceProvider>
            <ApprovalProvider>
                {children}
            </ApprovalProvider>
        </AttendanceProvider>
    );
}