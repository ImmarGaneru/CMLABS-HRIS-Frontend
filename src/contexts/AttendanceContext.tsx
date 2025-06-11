"use client";

import api from '@/lib/axios';
import { format } from 'date-fns';
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { request } from "@/lib/request";
import { Check } from 'lucide-react';

export interface CheckClockSetting {
    id: string;
    id_company: string;
    name: string;
    type: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
    check_clock_setting_time: CheckClockSettingTime[];
}

export interface CheckClockSettingTime {
    id: string;
    id_ck_setting: string;
    day: string;
    clock_in: string;
    clock_out: string;
    break_start: string;
    break_end: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

interface AttendanceContext {
    checkClockSettings: CheckClockSetting[];
    fetchCheckClockSettings: () => Promise<void>;
    completeNewCheckClockSetting: (checkClockSetting: CheckClockSetting) => Promise<void>;
    fetchSingleCheckClockSetting: (id: string) => Promise<CheckClockSetting>;
    completeUpdateCheckClockSetting: (checkClockSettingId: string, checkClockSetting: CheckClockSetting) => Promise<void>;
    deleteCheckClockSetting: (checkClockSettingId: string) => Promise<void>;
    options: { value: string; label: string }[];
    isLoading: boolean;
}

const AttendanceContext = createContext<AttendanceContext | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
    const [checkClockSettings, setApprovals] = useState<CheckClockSetting[]>([]);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCheckClockSettings = async () => {
        try {
            const data = await request<CheckClockSetting[]>(api.get("/admin/attendance/check-clock-setting"));
            setApprovals(data);
        } catch (error) {
            toast.error("Failed to fetch attendance data.");
        }
    };

    const completeNewCheckClockSetting = async (checkClockSetting: CheckClockSetting) => {
        try {
            await request(api.post(`/admin/attendance/check-clock-setting/complete-new`, checkClockSetting));
            toast.success("New check clock setting created successfully.");
            fetchCheckClockSettings();
        } catch (error) {
            toast.error("Failed to create new check clock setting.");
        }
    };

    const completeUpdateCheckClockSetting = async (checkClockSettingId: string, checkClockSetting: CheckClockSetting) => {
        try {
            await request(api.put(`/admin/attendance/check-clock-setting/complete-update/${checkClockSettingId}`, checkClockSetting));
            toast.success("Check clock setting updated successfully.");
            fetchCheckClockSettings();
        }
        catch (error) {
            toast.error("Failed to update check clock setting.");
        }
    }

    const deleteCheckClockSetting = async (checkClockSettingId: string) => {
        try {
            await request(api.delete(`/admin/attendance/check-clock-setting/delete/${checkClockSettingId}`));
            toast.success("Check clock setting deleted successfully.");
            fetchCheckClockSettings();
        } catch (error) {
            toast.error("Failed to delete check clock setting.");
        }
    }

    const fetchSingleCheckClockSetting = async (id: string) => {
        try {
            const data = await request<CheckClockSetting>(api.get(`/admin/attendance/check-clock-setting/${id}`));
            return data;
        } catch (error) {
            toast.error("Failed to fetch check clock setting.");
            throw error;
        }
    }

    useEffect(() => {
        fetchCheckClockSettings();
    }, []);

    return (
        <AttendanceContext.Provider
            value={{
                checkClockSettings,
                fetchCheckClockSettings,
                fetchSingleCheckClockSetting,
                completeNewCheckClockSetting,
                completeUpdateCheckClockSetting,
                deleteCheckClockSetting,
                options,
                isLoading
            }}
        >
            {children}
        </AttendanceContext.Provider>
    );
}

export const useAttendance = () => {
    const context = React.useContext(AttendanceContext);
    if (!context) {
        throw new Error("useAttendance must be used within an AttendanceProvider");
    }
    return context;
};