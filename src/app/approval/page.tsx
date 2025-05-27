"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, SlidersHorizontal, Eye } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { FaEye } from "react-icons/fa";

export default function ApprovalPage() {
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");
    // type AttendanceStatus = "Waiting Approval" | "Rejected" | "Approved"
    // const statuses: Record<AttendanceStatus, string> = {
    //     "Waiting Approval": "bg-yellow-500 text-white",
    //     "Rejected": "bg-red-500 text-white",
    //     "Approved": "bg-green-600 text-white",
    // }

    const statusFilters = [
        {label: 'Waiting Approval', value: 'Waiting Approval'},
        {label: 'Rejected', value: 'Rejected'},
        {label: 'Approved', value: 'Approved'},
    ];

    const typeFilters = [
        {label: 'Izin', value: 'Izin'},
        {label: 'Sakit', value: 'Sakit'},
        {label: 'Cuti', value: 'Cuti'},
        {label: 'Perubahan Data', value: 'Perubahan Data'},
    ];

    type Approval = {
        id: number
        nama: string
        type: string
        date: string
        status: string
    }

    const approvalColumns = useMemo<ColumnDef<Approval>[]>(
        () => [
            {
                id: "No",
                header: "No",
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        {row.index + 1}
                    </div>
                ),
                size: 60,
            },
            {
                accessorKey: "nama",
                header: "Nama Karyawan",
                cell: info => (
                    <div className="truncate w-[180px]">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "type",
                header: "Jenis Pengajuan",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue()as string}
                    </div>
                ),
            },
            {
                accessorKey: "date",
                header: "Tanggal Pengajuan",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: info => {
                    const status = info.getValue() as string;
                    const statusStyle: Record<string, string> = {
                        "Waiting Approval": "bg-yellow-100 text-yellow-800",
                        "Rejected": "bg-red-100 text-red-800",
                        "Approved": "bg-green-100 text-green-800",
                    };
                    return (
                        <div className="flex justify-center">
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
                    const data = row.original;
                    return (
                        <div className="flex gap-2 justify-center">
                            <button
                                title="Detail"
                                onClick={() => router.push(`/approval/${data.id}`)}
                                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                            >
                                <FaEye />
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const dummyData: Approval[] = [
        {
            id: 1,
            nama: "Ahmad",
            type: "Izin",
            date: "26/04/2025",
            status: "Waiting Approval",
        },
        {
            id: 2,
            nama: "Luna Christina Ajeng",
            type: "Sakit",
            date: "26/04/2025",
            status: "Waiting Approval",
        },
        {
            id: 3,
            nama: "Didik Putra Utarlana Mahmud",
            type: "Cuti",
            date: "26/04/2025",
            status: "Waiting Approval",
        },
        {
            id: 4,
            nama: "Nirmala Sukma",
            type: "Izin",
            date: "26/04/2025",
            status: "Approved",
        },
        {
            id: 5,
            nama: "Didik Putra Utarlana Mahmud",
            type: "Izin",
            date: "26/04/2025",
            status: "Rejected",
        },
        {
            id: 6,
            nama: "Luna Christina Ajeng",
            type: "Perubahan Data",
            date: "26/04/2025",
            status: "Approved",
        },
        {
            id: 7,
            nama: "Ahmad",
            type: "Perubahan Data",
            date: "26/04/2025",
            status: "Approved",
        },
        {
            id: 8,
            nama: "Luna Christina Ajeng",
            type: "Izin",
            date: "26/04/2025",
            status: "Rejected",
        },
        {
            id: 9,
            nama: "Nirmala Sukma",
            type: "Perubahan Data",
            date: "26/04/2025",
            status: "Approved",
        },
    ];
//FUNGSI-FUNGSI FILTER==

    // Filter data based on search text, status and type
    const filteredData = useMemo(() => {
        return dummyData.filter((item) => {
            const matchesSearch = item.nama.toLowerCase().includes(filterText.toLowerCase()) ||
                                item.type.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = !filterStatus || item.status === filterStatus;
            const matchesType = !filterType || item.type === filterType;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [filterText, filterStatus, filterType]);

//END FUNGSI-FUNGSI FILTER==

//RETURN CLASS MAIN FUNCTION==
    return (
        <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <DataTableHeader
                        title="Approval Overview"
                        hasSearch={true}
                        hasFilter={true}
                        hasSecondFilter={true}
                        hasExport={true}
                        hasImport={true}
                        hasAdd={true}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        // filter pertama (tipe)
                        filterValue={filterType}
                        onFilterChange={setFilterType}
                        filterOptions={typeFilters}
                        // filter kedua (status)
                        secondFilterValue={filterStatus}
                        onSecondFilterChange={setFilterStatus}
                        secondFilterOptions={statusFilters}
                        
                        onAdd={() => router.push("/attendance/create")}
                    />
                    <DataTable columns={approvalColumns} data={filteredData}/>
                </div>
            </div>
            
            {/* <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-bold">Approval Overview</h1>
                    <Input placeholder="Search here..." className="max-w-lg" />
                    <div className="flex gap-2">
                        <Button variant="outline"><SlidersHorizontal/> Filter</Button>
                        <Button
                            onClick={() => router.push("/attendance/create")}
                            className="bg-[#1E3A5F]"
                        >
                            + Tambah Data
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Karyawan</TableHead>
                            <TableHead>Jenis Pengajuan</TableHead>
                            <TableHead>Tanggal Pengajuan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvals.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.nama}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>
                                    <Badge className={statuses[row.status as AttendanceStatus]}>{row.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        className="bg-[#2D8EFF]"
                                        onClick={() => router.push(`/approval/${row.id}`)}
                                    >
                                        <Eye/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">Showing 1 to 10 of 80 records</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary">2</Button>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div> */}
        </div>
    );
}
