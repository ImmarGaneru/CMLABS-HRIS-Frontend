"use client";

import React, { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";

import { useOvertime, OvertimeSetting } from "@/contexts/OvertimeContext"; // Sesuaikan path jika perlu
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

// Skema validasi menggunakan Zod
const ruleSchema = z.object({
    day_type: z.enum(["weekday", "weekend", "holiday"]),
    start_hour: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam tidak valid (HH:MM)"),
    end_hour: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam tidak valid (HH:MM)"),
    rate_multiplier: z.coerce.number().min(0, "Rate tidak boleh negatif"),
    max_hour: z.coerce.number().int().min(0, "Max jam tidak boleh negatif"),
    notes: z.string().optional(),
});

const settingSchema = z.object({
    name: z.string().min(3, "Nama jenis lembur minimal 3 karakter"),
    source: z.enum(["government", "company"]),
    is_active: z.boolean(),
    rules: z.array(ruleSchema).min(1, "Minimal harus ada satu aturan"),
});

type FormData = z.infer<typeof settingSchema>;

export default function OvertimeSettingsPage() {
    const {
        overtimeSettings,
        isLoading,
        createOvertimeSetting,
        updateOvertimeSetting,
        deleteOvertimeSetting
    } = useOvertime();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState<OvertimeSetting | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState<string | null>(null);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            name: "",
            source: "company",
            is_active: true,
            rules: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rules",
    });

    // Buka modal untuk mode edit dan isi form dengan data yang ada
    const handleEdit = (setting: OvertimeSetting) => {
        setSelectedSetting(setting);
        reset(setting); // Mengisi form dengan data dari 'setting'
        setIsModalOpen(true);
    };

    // Buka modal untuk mode tambah data baru
    const handleAdd = () => {
        setSelectedSetting(null);
        reset({ // Mengosongkan form
            name: "",
            source: "company",
            is_active: true,
            rules: [{ day_type: "weekday", start_hour: "17:00", end_hour: "18:00", rate_multiplier: 1.5, max_hour: 0, notes: "" }]
        });
        setIsModalOpen(true);
    };

    // Fungsi yang dipanggil saat form disubmit
    const onSubmit = async (data: FormData) => {
        if (selectedSetting) {
            // Mode Update
            await updateOvertimeSetting(selectedSetting.id, data);
        } else {
            // Mode Create
            await createOvertimeSetting(data);
        }
        setIsModalOpen(false);
    };

    // Membuka dialog konfirmasi hapus
    const handleDelete = (id: string) => {
        setSettingToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    // Mengkonfirmasi dan menjalankan fungsi hapus
    const confirmDelete = () => {
        if (settingToDelete) {
            deleteOvertimeSetting(settingToDelete);
            setIsDeleteDialogOpen(false);
            setSettingToDelete(null);
        }
    };

    // Definisi kolom untuk DataTable
    const columns = useMemo<ColumnDef<OvertimeSetting>[]>(
        () => [
            { header: "No", cell: ({ row }) => row.index + 1, size: 50 },
            { accessorKey: "name", header: "Nama Jenis Lembur" },
            { accessorKey: "source", header: "Sumber", cell: ({ row }) => row.original.source === 'government' ? 'Pemerintah' : 'Perusahaan' },
            { accessorKey: "rules", header: "Jumlah Aturan", cell: ({ row }) => `${row.original.rules.length} Aturan` },
            {
                accessorKey: "is_active",
                header: "Status",
                cell: ({ row }) => (
                    <span className={`px-2 py-1 text-xs rounded ${row.original.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {row.original.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                )
            },
            {
                id: "actions",
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}><FaEdit /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}><FaTrash /></Button>
                    </div>
                ),
            },
        ],
        []
    );

    if (isLoading && !overtimeSettings.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-white rounded-xl p-8 shadow-md mt-6">
                <DataTableHeader
                    title="Pengaturan Lembur"
                    onAdd={handleAdd}
                    hasAdd={true}
                />
                <DataTable columns={columns} data={overtimeSettings} />
            </div>

            {/* Modal untuk Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{selectedSetting ? "Edit Pengaturan Lembur" : "Tambah Pengaturan Lembur"}</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Form Utama */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label>Nama Jenis Lembur</label>
                                    <Input {...register("name")} />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label>Sumber Peraturan</label>
                                    <select {...register("source")} className="w-full p-2 border rounded">
                                        <option value="company">Perusahaan</option>
                                        <option value="government">Pemerintah</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" {...register("is_active")} />
                                        Aktifkan Pengaturan Ini
                                    </label>
                                </div>
                            </div>

                            {/* Form Aturan Dinamis */}
                            <div className="mb-4">
                                <h3 className="font-bold mb-2">Aturan Rate Lembur</h3>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 border p-3 rounded-md mb-3 relative">
                                        <button type="button" onClick={() => remove(index)} className="absolute top-1 right-1 text-red-500 hover:text-red-700"><FaTimes /></button>
                                        <div><label>Tipe Hari</label><select {...register(`rules.${index}.day_type`)} className="w-full p-2 border rounded"><option value="weekday">Hari Kerja</option><option value="weekend">Akhir Pekan</option><option value="holiday">Hari Libur</option></select></div>
                                        <div><label>Jam Mulai</label><Input type="time" {...register(`rules.${index}.start_hour`)} /></div>
                                        <div><label>Jam Selesai</label><Input type="time" {...register(`rules.${index}.end_hour`)} /></div>
                                        <div><label>Rate Pengali</label><Input type="number" step="0.1" {...register(`rules.${index}.rate_multiplier`)} /></div>
                                        <div><label>Max Jam</label><Input type="number" {...register(`rules.${index}.max_hour`)} placeholder="0=unlimited" /></div>
                                        <div className="col-span-full"><label>Catatan</label><Input {...register(`rules.${index}.notes`)} placeholder="Opsional"/></div>
                                    </div>
                                ))}
                                {errors.rules && <p className="text-red-500 text-sm">{errors.rules.message}</p>}
                                <Button type="button" variant="outline" onClick={() => append({ day_type: "weekday", start_hour: "", end_hour: "", rate_multiplier: 1.5, max_hour: 0, notes: "" })}><FaPlus className="mr-2"/>Tambah Aturan</Button>
                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                                <Button type="submit">Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dialog Konfirmasi Hapus */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold">Anda yakin?</h3>
                        <p className="my-2">Apakah Anda yakin ingin menghapus pengaturan ini?</p>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                            <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}