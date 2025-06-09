import React from "react";
import { ApprovalProvider } from "@/contexts/ApprovalContext";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <ApprovalProvider>
                    {children}
        </ApprovalProvider>
    );
}