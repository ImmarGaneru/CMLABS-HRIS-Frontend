"use client"

import {useRouter} from "next/navigation";
import DataTableHeader from "@/components/DatatableHeader"
import { DataTable } from "@/components/Datatable"
import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { FaEdit, FaEye } from "react-icons/fa";


export default function AttendacePage() {
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterTipeKehadiran, setFilterTipeKehadiran] = useState("");
    const [filterTanggal, setFilterTanggal] = useState("");
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const kehadiranFilters = [
        {label: 'On Time', value: 'On Time'},
        {label: 'Late', value: 'Late'},
        {label: 'Waiting', value: 'Waiting'},
        {label: 'Sick', value: 'Sick'},
        {label: 'Cuti', value: 'Cuti'},
    ];

    type Attendance = {
        id: number
        name: string
        jabatan: string
        date: string
        clockIn: string
        clockOut: string
        hours: string
        status: string
    }

    //Kolom untuk tabel attendance
    const attendanceColumns = useMemo<ColumnDef<Attendance>[]>(
        () => [
            {
                id: "No",
                header: "No",
                cell: ({row}) => (
                    <div className="flex justify-center">
                        {row.index +1}
                    </div>
                ),
                size: 60,
            },
            {
                accessorKey: "name",
                header: "Nama",
                cell:  info => (
                    <div className="truncate w-[120px]">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "jabatan",
                header: "Jabatan",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "date",
                header: "Tanggal",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "clockIn",
                header: "Clock-In",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "clockOut",
                header: "Clock-Out",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "hours",
                header: "Total Jam",
                cell: info => (
                    <div className="flex justify-start pl-6 min-w-[120px]">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: info => {
                    const status = info.getValue() as string;

                    //Mapping jenis status
                    const statusStyle: Record<string, string> = {
                        "On Time": "bg-green-100 text-green-800",
                        "Late": "bg-red-100 text-red-800",
                        "Waiting": "bg-yellow-100 text-yellow-800",
                        "Sick": "bg-teal-100 text-teal-800",
                        "Cuti": "bg-teal-100 text-teal-800",
                    };
                    return(
                        <div className="flex justify-center w-[80px]">
                        <span className={`px-2 py-1 text-xs rounded ${statusStyle[status] ?? "bg-gray-100 text-gray-800"}`}>
                            {info.getValue() as String}
                        </span>
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: "Aksi",
                cell: ({ row }) => {
                    const data = row.original
                    return (
                        <div className="flex gap-2 justify-center">
                            <button
                                title="Detail"
                                onClick={() => router.push(`/attendance`)}
                                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                            >
                                <FaEye />
                            </button>
                            <button
                                title="Edit"
                                onClick={() => router.push(`/attendance`)}
                                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                            >
                                <FaEdit />
                            </button>
                        </div>
                    )
                },
            },
        ],[]
    )

    //Dummy data untuk attendance berdasarkan type Attendance
    const dummyData: Attendance[] = [
        {
            id: 1,
            name: "Ahmad",
            jabatan: "Manager",
            date: "11/12/2025",
            clockIn: "08:00",
            clockOut: "17:00",
            hours: "9 h 0 m",
            status: "Waiting"
        },
        {
            id: 2,
            name: "Luna Christina Ajeng",
            jabatan: "Manager",
            date: "11/12/2025",
            clockIn: "08:40",
            clockOut: "17:00",
            hours: "8 h 20 m",
            status: "Late"
        },
        {
            id: 3,
            name: "Didik Putra Utarlana Mahmud",
            jabatan: "CEO",
            date: "11/12/2025",
            clockIn: "08:00",
            clockOut: "17:00",
            hours: "9 h 0 m",
            status: "On Time"
        },
        {
            id: 4,
            name: "Nirmala Sukma",
            jabatan: "Karyawan",
            date: "11/12/2025",
            clockIn: "08:00",
            clockOut: "17:00",
            hours: "9 h 0 m",
            status: "Sick"
        },
    ];

//FUNGSI-FUNGSI FILTER==

    //Filtered data agar bisa diimplementasikan fitur search & filter
    const filteredData = useMemo(() => {
        return dummyData.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(filterText.toLowerCase());
            const mathcesTipeKehadiran = !filterTipeKehadiran || item.status === filterTipeKehadiran;
            const mathcesTanggal = !filterTanggal || item.date === filterTanggal;
            return matchesSearch && mathcesTipeKehadiran && mathcesTanggal;
        });
    }, [filterText, filterTipeKehadiran, filterTanggal]);

//END FUNGSI-FUNGSI FILTER==

//RETURN CLASS MAIN FUNCTION==
    return (
        <main className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    {/* Data Table Header */}
                    <DataTableHeader
                        title="Informasi Lembur"
                        hasSearch={true}
                        hasFilter={true}
                        hasExport={true}
                        hasDateFilter={true}
                        dateFilterValue={filterTanggal}
                        onDateFilterChange={setFilterTanggal}
                        hasImport={true}
                        hasAdd={true}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        filterValue={filterTipeKehadiran}
                        onFilterChange={setFilterTipeKehadiran}
                        filterOptions={kehadiranFilters}
                        onAdd={() => router.push("/#")}
                    />
                    {/* Data Tabel Isi attendance */}
                    <DataTable columns={attendanceColumns} data={filteredData}/>
                </div>
            </div>

        </main>
    )
}
