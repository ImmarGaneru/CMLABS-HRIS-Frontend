"use client";

import api from '@/lib/axios';
import { format } from 'date-fns';
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { request } from "@/lib/request";

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

interface ApprovalUser {
    id: string;
    employee: {
        first_name: string;
        last_name: string;
    };
}

interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
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
    isAdmin: () => Promise<boolean>;
    getCurrentUser: () => Promise<ApprovalUser>;
}

const ApprovalContext = createContext<ApprovalContext | undefined>(undefined);

export function ApprovalProvider({ children }: { children: React.ReactNode }) {
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchApprovals = async () => {
        try {
            const data = await request<Approval[]>(api.get("/approvals"));
            setApprovals(data);
        } catch (error) {
            toast.error("Gagal dalam mengambil data persetujuan.");
        }
    };

    const approveRequest = async (id: string) => {
        try {
            await request(api.post(`/approvals/${id}/approve`));
            toast.success("Persetujuan berhasil diterima.");
            await fetchApprovals();
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Gagal dalam menyetujui permintaan.");
        }
    };

    const rejectRequest = async (id: string) => {
        try {
            await request(api.post(`/approvals/${id}/reject`));
            toast.success("Persetujuan berhasil ditolak.");
            await fetchApprovals();
        } catch (error) {
            toast.error("Gagal dalam menolak permintaan.");
        }
    };

    const fetchUsers = async (inputValue: string) => {
        setIsLoading(true);
        try {
            const res = await request<PaginatedResponse<ApprovalUser>>(
                api.get("/approvals/create", {
                    params: { search: inputValue.toLowerCase() || "" },
                })

            );
            const users = res.data.map((user) => ({
                value: user.id,
                label: `${user.employee.first_name} ${user.employee.last_name}`.toLowerCase(),
            }));
            setOptions(users);
        } catch (error) {
            toast.error("Gagal memuat data karyawan.");
        } finally {
            setIsLoading(false);
        }
    }

    const submitApproval = async (data: any) => {
        const formData = new FormData();

        if (data.request_type === "overtime") {
            formData.append("start_date", format(new Date(`${data.overtime_dates} ${data.start_time}`), "yyyy-MM-dd HH:mm"));
            formData.append("end_date", format(new Date(`${data.overtime_dates} ${data.end_time}`), "yyyy-MM-dd HH:mm"));
        } else {
            if (data.start_date) {
                formData.append("start_date", format(new Date(data.start_date), "yyyy-MM-dd HH:mm"));
            }
            if (data.end_date) {
                formData.append("end_date", format(new Date(data.end_date), "yyyy-MM-dd HH:mm"));
            }
        }

        Object.entries(data).forEach(([key, value]) => {
            if (key !== "overtime_dates" && key !== "start_time" && key !== "end_time" && key !== "document") {
                formData.append(key, value as string);
            }
        });

        if (data.document) {
            formData.append("document", data.document);
        }

        try {
            await api.post("approvals", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("Data berhasil disimpan!");
            await fetchApprovals();
        } catch (error) {
            toast.error("Gagal menyimpan data!");
        }
    };

    const isAdmin = async (): Promise<boolean> => {
        try {
            const response = await api.get('/approvals/isAdmin');
            return response.data.data.isAdmin;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    };

    const getCurrentUser = async (): Promise<ApprovalUser> => {
        try {
            const response = await api.get('/auth/me');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    }

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
                isLoading,
                isAdmin,
                getCurrentUser
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