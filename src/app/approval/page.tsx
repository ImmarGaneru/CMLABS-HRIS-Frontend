"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";


export default function ApprovalPage() {
    const router = useRouter();
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");

    useEffect(() => {
        axios.get("/api/approvals", {
            headers: {
                Authorization: 'Bearer 12|aijXRUwCz7kyNlDEgKS3AcUsWm0k5zj3XaMCexu7424b355e', // Replace with your token
            },
        }).then((response) => {
            setApprovals(response.data.data);
        }).catch((error) => {
            console.error("Error fetching approvals:", error);
        });
    }, []);

    const statusFilters = [
        {label: 'Waiting Approval', value: 'pending'},
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
        id_user: string
        request_type: string
        created_at: string
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
                accessorKey: "id_user",
                header: "Nama Karyawan",
                cell: info => {
                    const row = info.row.original;
                    const fullName = `${row.employee?.first_name ?? ""} ${row.employee?.last_name ?? ""}`.trim();
                    return (
                        <div className="truncate w-[180px]">
                            {fullName || "N/A"}
                        </div>
                    );
                },
            },
            {
                accessorKey: "request_type",
                header: "Jenis Pengajuan",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue()as string}
                    </div>
                ),
            },
            {
                accessorKey: "created_at",
                header: "Tanggal Pengajuan",
                cell: info => {
                    const rawDate = info.getValue() as string;
                    const formattedDate = format(new Date(rawDate), "dd/MM/yyyy");
                    return (
                        <div className="flex justify-center">
                            {formattedDate}
                        </div>
                    );
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: info => {
                    const status = info.getValue() as string;
                    const statusStyle: Record<string, string> = {
                        "pending": "bg-yellow-100 text-yellow-800",
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

    // const dummyData: Approval[] = [
    //     {
    //         id: 1,
    //         nama: "Ahmad",
    //         type: "Izin",
    //         date: "26/04/2025",
    //         status: "Waiting Approval",
    //     },
    //     {
    //         id: 2,
    //         nama: "Luna Christina Ajeng",
    //         type: "Sakit",
    //         date: "26/04/2025",
    //         status: "Waiting Approval",
    //     },
    //     {
    //         id: 3,
    //         nama: "Didik Putra Utarlana Mahmud",
    //         type: "Cuti",
    //         date: "26/04/2025",
    //         status: "Waiting Approval",
    //     },
    //     {
    //         id: 4,
    //         nama: "Nirmala Sukma",
    //         type: "Izin",
    //         date: "26/04/2025",
    //         status: "Approved",
    //     },
    //     {
    //         id: 5,
    //         nama: "Didik Putra Utarlana Mahmud",
    //         type: "Izin",
    //         date: "26/04/2025",
    //         status: "Rejected",
    //     },
    //     {
    //         id: 6,
    //         nama: "Luna Christina Ajeng",
    //         type: "Perubahan Data",
    //         date: "26/04/2025",
    //         status: "Approved",
    //     },
    //     {
    //         id: 7,
    //         nama: "Ahmad",
    //         type: "Perubahan Data",
    //         date: "26/04/2025",
    //         status: "Approved",
    //     },
    //     {
    //         id: 8,
    //         nama: "Luna Christina Ajeng",
    //         type: "Izin",
    //         date: "26/04/2025",
    //         status: "Rejected",
    //     },
    //     {
    //         id: 9,
    //         nama: "Nirmala Sukma",
    //         type: "Perubahan Data",
    //         date: "26/04/2025",
    //         status: "Approved",
    //     },
    // ];
//FUNGSI-FUNGSI FILTER==

    // Filter data based on search text, status and type
    const filteredData = useMemo(() => {
        return approvals.filter((item) => {
            const matchesSearch = item.id_user.toLowerCase().includes(filterText.toLowerCase()) ||
                                item.request_type.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = !filterStatus || item.status === filterStatus;
            const matchesType = !filterType || item.request_type === filterType;
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
        </div>
    );
}
