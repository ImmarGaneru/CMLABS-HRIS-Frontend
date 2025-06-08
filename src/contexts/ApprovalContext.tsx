"use client";

import api from '@/lib/axios';
import { format } from 'date-fns';
import React, {createContext, useEffect, useState} from "react";
import {toast} from "sonner";

export interface Approval {
    id: string;
    id_user: string;
    request_type: string;
    created_at: string;
    status: string;
    start_date: string;
    end_date: string;
    reason: string;
    employee: {
        id: string;
        first_name: string;
        last_name: string;
        position: {
            name: string;
        }
    }
}

interface ApprovalContext {
    approvals: Approval[];
    fetchApprovals: () => Promise<void>;
    approveRequest: (id: string) => Promise<void>;
    rejectRequest: (id: string) => Promise<void>;
    fetchUsers: (inputValue: string) => Promise<void>;
    submitApproval: (data: any) => Promise<void>;
    options: { value: string; label: string }[];
    isLoading: boolean;
}

const ApprovalContext = createContext<ApprovalContext | undefined>(undefined);

export function ApprovalProvider({ children }: { children: React.ReactNode }) {
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchApprovals = async () => {
        try {
            const response = await api.get("/approvals");
            setApprovals(response.data.data);
        } catch (error) {
            console.error("Error fetching approvals:", error);
            toast.error("Gagal dalam mengambil data persetujuan.");
        }
    };

    const approveRequest = async (id: string) => {
        try {
            await api.post(`/approvals/${id}/approve`);
            toast.success("Persetujuan berhasil diterima.");
            await fetchApprovals();
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Gagal dalam menyetujui permintaan.");
        }
    };

    const rejectRequest = async (id: string) => {
        try {
            await api.post(`/approvals/${id}/reject`);
            toast.success("Persetujuan berhasil ditolak.");
            await fetchApprovals();
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Gagal dalam menolak permintaan.");
        }
    };

    const fetchUsers = async (inputValue: string) => {
        setIsLoading(true);
        try {
            const response = await api.get("/approvals/create", {
                params: { search: inputValue.toLowerCase() || ""},
            });
            const users = response.data.data.data.map((user: { id: string; employee: { first_name: string; last_name: string }}) => ({
                value: user.id,
                label: `${user.employee.first_name} ${user.employee.last_name}`.toLowerCase(),
            }));
            setOptions(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Gagal memuat data karyawan.");
        } finally {
            setIsLoading(false);
        }
    }

    const submitApproval = async (data: any) => {
        let transformedData = { ...data };

        if (data.request_type === "overtime") {
            transformedData.start_date = format(new Date(`${data.overtime_dates} ${data.start_time}`), "yyyy-MM-dd HH:mm");
            transformedData.end_date = format(new Date(`${data.overtime_dates} ${data.end_time}`), "yyyy-MM-dd HH:mm");
            delete transformedData.overtime_dates;
            delete transformedData.start_time;
            delete transformedData.end_time;
        } else {
            if (data.start_date) {
                transformedData.start_date = format(new Date(data.start_date), "yyyy-MM-dd HH:mm");
            }
            if (data.end_date) {
                transformedData.end_date = format(new Date(data.end_date), "yyyy-MM-dd HH:mm");
            }
        }

        try {
            const response = await api.post("approvals", transformedData);
            toast.success("Data berhasil disimpan!");
            console.log("Response:", response.data);
        } catch (error) {
            toast.error("Gagal menyimpan data!");
            console.error("Error submitting approval:", error);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    return (
        <ApprovalContext.Provider
            value={{
                approvals,
                fetchApprovals,
                approveRequest,
                rejectRequest,
                fetchUsers,
                submitApproval,
                options,
                isLoading
            }}
        >
            {children}
        </ApprovalContext.Provider>
    );
}

export const useApproval = () => {
    const context = React.useContext(ApprovalContext);
    if (!context) {
        throw new Error("useApproval must be used within an ApprovalProvider");
    }
    return context;
};