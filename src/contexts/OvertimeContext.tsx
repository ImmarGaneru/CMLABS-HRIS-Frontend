"use client";

import React, {createContext, useEffect, useState, useContext, ReactNode, useCallback} from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

export interface OvertimeSettingRule {
    id: string;
    day_type: 'weekday' | 'weekend' | 'holiday';
    start_hour: string;
    end_hour: string;
    rate_multiplier: number;
    max_hour: number;
    notes?: string;
}

export interface OvertimeSetting {
    id: string;
    name: string;
    source: 'government' | 'company';
    is_active: boolean;
    rules: OvertimeSettingRule[];
}

export interface Overtime {
    id: string;
    id_user: string;
    overtime_date: string;
    start_time: string;
    end_time: string;
    id_overtime_setting: string;
    approved_by: string | null;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    employee: { first_name: string; last_name: string; };
    setting: { name: string; };
    approver?: { name: string; };
}

interface OvertimeFilters {
    start_date?: string;
    end_date?: string;
    employee_name?: string;
}

export interface OvertimeSettingRulePayload {
    day_type: 'weekday' | 'weekend' | 'holiday';
    start_hour: string;
    end_hour: string;
    rate_multiplier: number;
    max_hour: number;
    notes?: string;
}

export interface OvertimeSettingPayload {
    name: string;
    source: 'government' | 'company';
    is_active?: boolean;
    rules: OvertimeSettingRulePayload[];
}

interface OvertimeContextType {
    // State
    overtimeSettings: OvertimeSetting[];
    overtimes: Overtime[];
    isLoading: boolean;
    // Functions
    fetchOvertimeSettings: () => Promise<void>;
    createOvertimeSetting: (data: OvertimeSettingPayload) => Promise<void>;
    updateOvertimeSetting: (id: string, data: OvertimeSettingPayload) => Promise<void>;
    deleteOvertimeSetting: (id: string) => Promise<void>;
    fetchOvertimes: (filters?: OvertimeFilters) => Promise<void>;
    createOvertime: (data: Omit<Overtime, 'id' | 'approved_by' | 'status' | 'employee' | 'setting' | 'approver'>) => Promise<void>;
    approveOvertime: (id: string) => Promise<void>;
    rejectOvertime: (id: string) => Promise<void>;
}

const OvertimeContext = createContext<OvertimeContextType | undefined>(undefined);

export function OvertimeProvider({ children }: { children: ReactNode }) {
    const [overtimeSettings, setOvertimeSettings] = useState<OvertimeSetting[]>([]);
    const [overtimes, setOvertimes] = useState<Overtime[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- FUNGSI UNTUK OVERTIME SETTINGS ---

    const fetchOvertimeSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/overtime-settings');
            setOvertimeSettings(response.data.data);
        } catch (error) {
            toast.error("Gagal mengambil data pengaturan lembur.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createOvertimeSetting = useCallback(async (data: OvertimeSettingPayload) => {
        try {
            const response = await api.post('/overtime-settings', data);
            toast.success("Pengaturan lembur berhasil dibuat.");
            setOvertimeSettings(prev => [...prev, response.data.data]);
        } catch (error) {
            toast.error("Gagal membuat pengaturan lembur.");
            console.error(error);
        }
    }, []);

    const updateOvertimeSetting = useCallback( async (id: string, data: OvertimeSettingPayload) => {
        try {
            const response = await api.put(`/overtime-settings/${id}`, data);
            toast.success("Pengaturan lembur berhasil diperbarui.");
            setOvertimeSettings(prev => prev.map(setting => setting.id === id ? response.data.data : setting));
        } catch (error) {
            toast.error("Gagal memperbarui pengaturan lembur.");
            console.error(error);
        }
    }, []);

    const deleteOvertimeSetting = useCallback( async (id: string) => {
        try {
            await api.delete(`/overtime-settings/${id}`);
            toast.success("Pengaturan lembur berhasil dihapus.");
            // Hapus dari state lokal
            setOvertimeSettings(prev => prev.filter(setting => setting.id !== id));
        } catch (error) {
            toast.error("Gagal menghapus pengaturan lembur.");
        }
    }, []);

    // --- FUNGSI UNTUK MANAJEMEN OVERTIME ---

    const fetchOvertimes = useCallback( async (filters: OvertimeFilters = {}) => {
        setIsLoading(true);
        try {
            const response = await api.get('/overtimes', { params: filters });
            setOvertimes(response.data.data);
        } catch (error) {
            toast.error("Gagal mengambil data lembur.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createOvertime = useCallback( async (data: Omit<Overtime, 'id' | 'approved_by' | 'status' | 'employee' | 'setting' | 'approver'>) => {
        try {
            const response = await api.post('/overtimes', data);
            toast.success("Data lembur berhasil ditambahkan.");
            // Tambahkan ke state lokal
            setOvertimes(prev => [response.data.data, ...prev]);
        } catch (error: any) {
            // Menangani error validasi dari backend
            if (error.response?.data?.errors?.time_conflict) {
                toast.error(error.response.data.errors.time_conflict[0]);
            } else {
                toast.error("Gagal menambahkan data lembur.");
            }
            console.error(error);
        }
    }, []);

    const approveOvertime = useCallback( async (id: string) => {
        try {
            const response = await api.patch(`/overtimes/${id}/approve`);
            toast.success("Lembur berhasil disetujui.");
            setOvertimes(prev => prev.map(o => o.id === id ? response.data.data : o));
        } catch (error) {
            toast.error("Gagal menyetujui lembur.");
        }
    }, []);

    const rejectOvertime = useCallback( async (id: string) => {
        try {
            const response = await api.patch(`/overtimes/${id}/reject`);
            toast.success("Lembur berhasil ditolak.");
            setOvertimes(prev => prev.map(o => o.id === id ? response.data.data : o));
        } catch (error) {
            toast.error("Gagal menolak lembur.");
        }
    }, []);

    // --- EFEK UNTUK MENGAMBIL DATA AWAL ---

    useEffect(() => {
        fetchOvertimeSettings();
    }, [fetchOvertimeSettings]);

    // --- RETURN PROVIDER ---

    return (
        <OvertimeContext.Provider
            value={{
                overtimeSettings,
                overtimes,
                isLoading,
                fetchOvertimeSettings,
                createOvertimeSetting,
                updateOvertimeSetting,
                deleteOvertimeSetting,
                fetchOvertimes,
                createOvertime,
                approveOvertime,
                rejectOvertime,
            }}
        >
            {children}
        </OvertimeContext.Provider>
    );
}

export function useOvertime() {
    const context = useContext(OvertimeContext);
    if (context === undefined) {
        throw new Error("useOvertime must be used within an OvertimeProvider");
    }
    return context;
}