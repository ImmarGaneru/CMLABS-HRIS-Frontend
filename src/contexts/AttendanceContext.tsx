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
    location_lat: number | null;
    location_lng: number | null;
    radius: number | null;
    check_clock_setting_time: CheckClockSettingTime[];
    user_ids: string[];
    users?: User[];
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

export interface CheckClock {
    id: string;
    id_user: string;
    id_ck_setting: string;
    id_ck_setting_time: string;
    clock_in: string;
    break_start: string;
    break_end: string;
    clock_out: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
    user: User;
    check_clock_setting_time: CheckClockSettingTime;
    check_clock_setting: CheckClockSetting;
}

export interface User {
    id: string;
    email: string;
    phone_number: string;
    id_workplace: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
    employee: Employee;
    workplace: Workplace;
}

export interface Employee {
    id: string;
    sign_in_code: string;
    id_user: string;
    first_name: string;
    last_name: string;
    nik: null;
    employment_status: string;
    address: string;
    id_position: null;
    jenis_kelamin: string;
    no_telp: string;
    cabang: string;
    grade: null;
    bank: null;
    no_rek: null;
    pendidikan: null;
    tipe_kontrak: null;
    tempat_lahir: null;
    tanggal_lahir: null;
    dokumen: null;
    avatar: null;
    start_date: null;
    end_date: null;
    tanggal_efektif: null;
    deleted_at: null;
    user: User;
}

export interface Workplace {
    id: string;
    name: string;
    id_manager: string;
    id_subscription: null;
    address: null;
    has_used_trial: boolean;
    deleted_at: null;
}


interface AttendanceContext {
    selfCheckClockSetting: CheckClockSetting | null;
    employeeCheckClocks: CheckClock[];
    selfCheckClocks: CheckClock[] | null;
    checkClockSettings?: CheckClockSetting[] | null;
    companyEmployees: Employee[];
    fetchCompanyEmployees: () => Promise<Employee[]>;
    fetchSelfCheckClockSetting: () => Promise<CheckClockSetting | null>;
    handleClockIn: (locationLatitude?: number, locationLongitude?: number) => Promise<void>;
    handleClockOut: (locationLatitude?: number, locationLongitude?: number) => Promise<void>;
    fetchEmployeeCheckClocks: () => Promise<void>;
    fetchSelfCheckClocks: () => Promise<void>;
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
    const [companyEmployees, setCompanyEmployees] = useState<Employee[]>([]);
    const [selfCheckClockSetting, setSelfCheckClockSetting] = useState<CheckClockSetting | null>(null);
    const [employeeCheckClocks, setEmployeeCheckClocks] = useState<CheckClock[]>([]);
    const [selfCheckClocks, setSelfCheckClocks] = useState<CheckClock[] | null>(null);
    const [checkClockSettings, setCheckClockSetting] = useState<CheckClockSetting[] | null>(null);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const getCurrentLocation = () => {
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        function success(pos: any) {
            const crd = pos.coords;

            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
        }

        function error(err: any) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    }

    const fetchCompanyEmployees = async () => {
        try {
            const data = await request<Employee[]>(api.get("/admin/employees/comp-employees"));
            setCompanyEmployees(data);
            return data;
        } catch (error) {
            toast.error("Failed to fetch company employees.");
            return [];
        }
    };

    const fetchSelfCheckClockSetting = async () => {
        try {
            const data = await request<CheckClockSetting>(api.get("/attendance/check-clock/self-ck-setting"));
            setSelfCheckClockSetting(data);
            return data;
        } catch (error) {
            toast.error("Failed to fetch self check clock setting.");
            return null;
        }
    };

    const handleClockIn = async (locationLatitude?: number, locationLongitude?: number) => {
        try {
            await request<CheckClock>(api.post("/attendance/check-clock/clock-in", {
                location_lat: locationLatitude,
                location_lng: locationLongitude
            }));
            await fetchSelfCheckClocks();
            toast.success("Clock-in successful.");
        } catch (error: any) {
            console.log("Clock-in error:", error);
            toast.error("Failed to clock-in: " + (error?.meta?.message || "Please try again."));
        }
    }

    const handleClockOut = async (locationLatitude?: number, locationLongitude?: number) => {
        try {
            await request<CheckClock>(api.post("/attendance/check-clock/clock-out", {
                location_lat: locationLatitude,
                location_lng: locationLongitude
            }));
            await fetchSelfCheckClocks();
            toast.success("Clock-in successful.");
        } catch (error: any) {
            console.log("Clock-in error:", error);
            toast.error("Failed to clock-in: " + (error?.meta?.message || "Please try again."));
        }
    }

    const fetchCheckClockSettings = async () => {
        try {
            const data = await request<CheckClockSetting[]>(api.get("/admin/attendance/check-clock-setting"));
            setCheckClockSetting(data);
        } catch (error) {
            toast.error("Failed to fetch attendance data.");
        }
    };

    const fetchEmployeeCheckClocks = async () => {
        try {
            const data = await request<CheckClock[]>(api.get("/admin/attendance/check-clock/employee-check-clocks"));
            setEmployeeCheckClocks(data);
        } catch (error) {
            toast.error("Failed to fetch employee check clocks.");
        }
    }

    const fetchSelfCheckClocks = async () => {
        try {
            const data = await request<CheckClock[] | null>(api.get("/attendance/check-clock/self"));
            setSelfCheckClocks(data);
        } catch (error) {
            toast.error("Failed to fetch self check clocks.");
        }
    }

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
        fetchSelfCheckClockSetting();
        fetchCheckClockSettings();
        fetchEmployeeCheckClocks();
        fetchSelfCheckClocks();
    }, []);

    return (
        <AttendanceContext.Provider
            value={{
                selfCheckClockSetting,
                checkClockSettings,
                employeeCheckClocks,
                selfCheckClocks,
                companyEmployees,
                fetchCompanyEmployees,
                fetchSelfCheckClockSetting,
                handleClockIn,
                handleClockOut,
                fetchEmployeeCheckClocks,
                fetchSelfCheckClocks,
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