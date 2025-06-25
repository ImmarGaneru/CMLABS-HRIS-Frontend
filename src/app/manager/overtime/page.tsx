"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO, isWithinInterval } from "date-fns";

import { useOvertime, Overtime } from "@/contexts/OvertimeContext";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaCheck, FaTimes } from "react-icons/fa";
import api from "@/lib/axios"; // Asumsi Anda menggunakan ini untuk user fetching

// --- Skema Validasi untuk Form Tambah Lembur ---
const overtimeSchema = z.object({
    id_user: z.string().uuid("Karyawan harus dipilih"),
    id_overtime_setting: z.string().uuid("Jenis lembur harus dipilih"),
    overtime_date: z.string().min(1, "Tanggal lembur harus diisi"),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam tidak valid"),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam tidak valid"),
    notes: z.string().optional(),
}).refine(data => data.end_time > data.start_time, {
    message: "Jam selesai harus setelah jam mulai",
    path: ["end_time"], // Menunjukkan error pada field end_time
});

type FormData = z.infer<typeof overtimeSchema>;
type UserOption = {
    value: string; label: string;
};

export default function OvertimeManagementPage() {
    const {
        overtimes,
        overtimeSettings,
        isLoading,
        fetchOvertimes,
        createOvertime,
        approveOvertime,
        rejectOvertime,
    } = useOvertime();

    // State untuk UI
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk filter
    const [nameFilter, setNameFilter] = useState("");
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

    // State untuk dropdown karyawan
    const [userOptions, setUserOptions] = useState<UserOption[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);

    // Form handling
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(overtimeSchema),
    });

    useEffect(() => {
        fetchOvertimes();
    }, [fetchOvertimes]);

    const filteredData = useMemo(() => {
        let filtered = overtimes;

        if (nameFilter) {
            filtered = filtered.filter(item =>
                `${item.employee.first_name} ${item.employee.last_name}`.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        if (dateFilter.from && dateFilter.to) {
            const startDate = parseISO(dateFilter.from);
            const endDate = parseISO(dateFilter.to);
            filtered = filtered.filter(item =>
                isWithinInterval(parseISO(item.overtime_date), { start: startDate, end: endDate })
            );
        }

        return filtered;
    }, [overtimes, nameFilter, dateFilter]);

    // Fungsi untuk mengambil data karyawan untuk dropdown
    const fetchUsersForSelect = async () => {
        setIsUsersLoading(true);
        try {
            // Kita asumsikan ada endpoint untuk mengambil daftar user, mirip dengan modul Approval
            const response = await api.get('/approvals/create'); // Ganti dengan endpoint user Anda
            const users = response.data.data.data.map((user: any) => ({
                value: user.id,
                label: `${user.employee.first_name} ${user.employee.last_name}`,
            }));
            setUserOptions(users);
        } catch (error) {
            console.error("Gagal mengambil data karyawan:", error);
        } finally {
            setIsUsersLoading(false);
        }
    };

    // Fungsi untuk membuka modal tambah data
    const handleAdd = () => {
        reset({
            overtime_date: new Date().toISOString().split('T')[0],
        });
        fetchUsersForSelect(); // Ambil data karyawan saat modal dibuka
        setIsModalOpen(true);
    };

    // Fungsi submit form
    const onSubmit = async (data: FormData) => {
        await createOvertime(data);
        setIsModalOpen(false);
    };

    // Definisi kolom untuk DataTable
    const columns = useMemo<ColumnDef<Overtime>[]>(
        () => [
            { header: "No", cell: ({ row }) => row.index + 1, size: 50 },
            { header: "Nama Karyawan", cell: ({ row }) => `${row.original.employee.first_name} ${row.original.employee.last_name}` },
            { header: "Tanggal Lembur", cell: ({ row }) => format(new Date(row.original.overtime_date), "dd MMM yyyy") },
            { header: "Waktu", cell: ({ row }) => `${row.original.start_time} - ${row.original.end_time}` },
            { header: "Jenis Lembur", cell: ({ row }) => row.original.setting.name },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    const statusStyle: Record<string, string> = {
                        "pending": "bg-yellow-100 text-yellow-800",
                        "rejected": "bg-red-100 text-red-800",
                        "approved": "bg-green-100 text-green-800",
                    };
                    return (
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusStyle[status]}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    );
                }
            },
            {
                id: "actions",
                header: "Aksi",
                cell: ({ row }) => (
                    row.original.status === 'pending' ? (
                        <div className="flex gap-2 justify-center">
                            <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => approveOvertime(row.original.id)}><FaCheck /></Button>
                            <Button variant="destructive" size="sm" onClick={() => rejectOvertime(row.original.id)}><FaTimes /></Button>
                        </div>
                    ) : null
                ),
            },
        ],
        [approveOvertime, rejectOvertime]
    );

    return (
        <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-white rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-start mb-4 gap-4 flex-wrap">
                    <DataTableHeader
                        title="Manajemen & Laporan Lembur"
                        hasAdd={true}
                        onAdd={handleAdd}
                        hasSearch={true}
                        searchValue={nameFilter}
                        onSearch={setNameFilter}
                    />
                </div>
                <div className="flex gap-4 items-center mb-4">
                    <label className="text-sm font-medium">Filter Tanggal:</label>
                    <Input type="date" value={dateFilter.from} onChange={e => setDateFilter(prev => ({...prev, from: e.target.value}))} className="w-auto" />
                    <span className="text-gray-500">-</span>
                    <Input type="date" value={dateFilter.to} onChange={e => setDateFilter(prev => ({...prev, to: e.target.value}))} className="w-auto" />
                </div>
                <DataTable columns={columns} data={filteredData} loading={isLoading} />
            </div>

            {/* Modal untuk Tambah Lembur */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">Tambah Data Lembur</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label>Karyawan</label>
                                <select {...register("id_user")} className="w-full p-2 border rounded" disabled={isUsersLoading}>
                                    <option value="">{isUsersLoading ? "Memuat..." : "Pilih Karyawan"}</option>
                                    {userOptions.map(user => <option key={user.value} value={user.value}>{user.label}</option>)}
                                </select>
                                {errors.id_user && <p className="text-red-500 text-sm">{errors.id_user.message}</p>}
                            </div>
                            <div>
                                <label>Jenis Lembur</label>
                                <select {...register("id_overtime_setting")} className="w-full p-2 border rounded">
                                    <option value="">Pilih Jenis Lembur</option>
                                    {overtimeSettings.map(setting => setting.is_active && <option key={setting.id} value={setting.id}>{setting.name}</option>)}
                                </select>
                                {errors.id_overtime_setting && <p className="text-red-500 text-sm">{errors.id_overtime_setting.message}</p>}
                            </div>
                            <div>
                                <label>Tanggal Lembur</label>
                                <Input type="date" {...register("overtime_date")} />
                                {errors.overtime_date && <p className="text-red-500 text-sm">{errors.overtime_date.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Jam Mulai</label>
                                    <Input type="time" {...register("start_time")} />
                                    {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time.message}</p>}
                                </div>
                                <div>
                                    <label>Jam Selesai</label>
                                    <Input type="time" {...register("end_time")} />
                                    {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label>Catatan (Opsional)</label>
                                <textarea {...register("notes")} rows={3} className="w-full p-2 border rounded" />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                                <Button type="submit">Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
