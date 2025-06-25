import React from "react";
import { ApprovalProvider } from "@/contexts/ApprovalContext";
import { AttendanceProvider } from "./AttendanceContext";
import {OvertimeProvider} from "@/contexts/OvertimeContext";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <AttendanceProvider>
            <OvertimeProvider>
                <ApprovalProvider>
                    {children}
                </ApprovalProvider>
            </OvertimeProvider>
        </AttendanceProvider>
    );
}