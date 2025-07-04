"use client"

import { useRouter } from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import { ColumnDef} from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import {FaArrowLeft, FaDownload, FaEdit, FaEye} from "react-icons/fa";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useApproval, Approval } from "@/contexts/ApprovalContext";


export default function ApprovalPage() {
    const { approvals } = useApproval();
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

    useEffect(() => {
    }, []);

    const statusFilters = [
        {label: 'Waiting Approval', value: 'pending'},
        {label: 'Rejected', value: 'rejected'},
        {label: 'Approved', value: 'approved'},
    ];

    const typeFilters = [
        {label: 'Izin', value: 'permit'},
        {label: 'Sakit', value: 'sick'},
        {label: 'Cuti', value: 'leave'},
        {label: 'Perubahan Data', value: 'Perubahan Data'},
    ];

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
                accessorKey: "request_type",
                header: "Jenis Pengajuan",
                cell: info => {
                    const type = info.getValue() as string;
                    return (
                        <div className="flex justify-center">
                            {type.charAt(0).toUpperCase() + type.slice(1) as string}
                        </div>
                    );

                },
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
                        "rejected": "bg-red-100 text-red-800",
                        "approved": "bg-green-100 text-green-800",
                    };
                    return (
                        <div className="flex justify-center">
                            <span className={`px-2 py-1 text-xs rounded ${statusStyle[status] ?? "bg-gray-100 text-gray-800"}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1) as string}
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
                                onClick={() => {
                                    setSelectedApproval(data);
                                    setIsDetailOpen(true);
                                }}
                                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                            >

                                <FaEye />
                            </button>
                            {data.status === 'pending' && (
                                <button
                                    title="Edit"
                                    onClick={() => router.push(`/employee/approval/edit/${data.id}`)}
                                    className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
                                >

                                    <FaEdit />
                                </button>
                            )}
                        </div>
                    );
                },
            },
        ],
        []
    );

//FUNGSI-FUNGSI FILTER==

    // Filter data based on search text, status and type
    const filteredData = useMemo(() => {
        if (!filterText && !filterStatus && !filterType) {
            return approvals;
        }
        return approvals.filter((item) => {
            const fullName = `${item.employee?.first_name ?? ""} ${item.employee?.last_name ?? ""}`.toLowerCase();
            const matchesSearch = fullName.includes(filterText.toLowerCase()) ||
                                item.request_type.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = !filterStatus || item.status === filterStatus;
            const matchesType = !filterType || item.request_type === filterType;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [approvals, filterText, filterStatus, filterType]);

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
                        onAdd={() => router.push("/employee/approval/tambah")}
                    />
                    <DataTable columns={approvalColumns} data={filteredData}/>
                </div>
            </div>

            {/*Detail Modal*/}
            {isDetailOpen && selectedApproval && (
                <>
                    <div onClick={() => setIsDetailOpen(false)}
                        className="fixed inset-0 bg-black opacity-50 z-50"
                    />
                    <div className="fixed top-0 right-0 h-screen w-[600px] bg-white border border-gray-300 rounded-l-lg shadow-lg z-50 p-5 font-sans overflow-auto"
                         onClick={(e) => e.stopPropagation()}
                    >
                        {/*Header*/}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[#1E3A5F] text-2xl font-bold">
                                Detail Pengajuan
                            </h2>
                            <Button onClick={() => setIsDetailOpen(false)}
                                    className="bg-[#1E3A5F] text-white py-2 px-4 rounded-lg font-bold"
                            >
                                <FaArrowLeft/>
                                Kembali
                            </Button>
                        </div>
                        {/* User Info */}
                        <div className="border rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M5.121 17.804A8 8 0 1116.95 6.05a8 8 0 01-11.828 11.754z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            {selectedApproval.employee?.first_name}{" "}
                                            {selectedApproval.employee?.last_name}
                                        </p>
                                        <p className="text-sm text-gray-600">{selectedApproval.employee?.position?.name || "Tidak memiliki posisi"}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                    selectedApproval.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : selectedApproval.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : selectedApproval.status === "approved"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}>
                                    {selectedApproval.status.charAt(0).toUpperCase() + selectedApproval.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Informasi Pengajuan */}
                        <div className="border rounded-lg p-4 mb-4">
                            <h3 className="font-bold text-[#1E3A5F] mb-2">Informasi Pengajuan</h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Tanggal Pengajuan</p>
                                    <p className="font-bold">{format(new Date(selectedApproval.created_at), "dd MMMM yyyy", {locale: id})}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Jenis Pengajuan</p>
                                    <p className="font-bold">{selectedApproval.request_type.charAt(0).toUpperCase() + selectedApproval.request_type.slice(1)}</p>
                                </div>
                                <div></div>
                                {["permit", "sick", "leave"].includes(selectedApproval.request_type) && (
                                    <>
                                        <div>
                                            <p className="text-gray-500">Tanggal Mulai</p>
                                            <p className="font-bold">{format(new Date(selectedApproval.start_date), "dd MMMM yyyy", { locale: id})}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Tanggal Selesai</p>
                                            <p className="font-bold">{format(new Date(selectedApproval.end_date), "dd MMMM yyyy", { locale: id})}</p>
                                        </div>
                                    </>
                                )}
                                { selectedApproval.request_type === "overtime" && (
                                    <>
                                        <div>
                                            <p className="text-gray-500">Tanggal Lembur</p>
                                            <p className="font-bold">{format(new Date(selectedApproval.end_date), "dd MMMM yyyy", { locale: id})}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Jam Lembur</p>
                                            <p className="font-bold">{format(new Date(selectedApproval.start_date), "HH:mm")} - {format(new Date(selectedApproval.end_date), "HH:mm")}</p>
                                        </div>
                                    </>

                                )}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="border rounded-lg p-4 mb-4">
                            <h3 className="font-bold text-[#1E3A5F] mb-2">Deskripsi Pengajuan</h3>
                            <p className="text-sm text-gray-700">
                                {selectedApproval.reason || "Tidak ada deskripsi."}
                            </p>
                        </div>

                        {/* Lampiran */}
                        <div className="border rounded-lg p-4 mb-6">
                            <h3 className="font-bold text-[#1E3A5F] mb-2">Lampiran</h3>
                            {selectedApproval.document_url ? (
                                <div className="flex flex-col gap3">
                                    <div className="flex items-center justify-between text-sm border px-3 py-2 rounded-lg">
                                        <span>{selectedApproval.document_url.split('/').pop()}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                className="text-gray-600 hover:text-gray-800"
                                                onClick={() => window.open(selectedApproval?.document_url, '_blank')}
                                                title="Lihat Lampiran"
                                            >
                                                <FaEye />
                                            </Button>
                                            {/* Download button */}
                                            <Button
                                                variant="ghost"
                                                className="text-gray-600 hover:text-gray-800"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = selectedApproval.document_url;
                                                    link.download = selectedApproval.document_url.split('/').pop() ?? 'default-filename';
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                title="Unduh Lampiran"
                                            >
                                                <FaDownload />
                                            </Button>
                                        </div>
                                    </div>

                                    {(() => {
                                        const url = selectedApproval.document_url.toLowerCase();
                                        if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')) {
                                            return (
                                                <div className="mt-2 border p-2 rounded-lg bg-gray-50">
                                                    <img
                                                        src={selectedApproval.document_url}
                                                        alt="Pratinjau Lampiran"
                                                        className="max-w-full h-auto rounded-lg mx-auto"
                                                    />
                                                </div>
                                            );
                                        }
                                        // Check for PDF files
                                        if (url.endsWith('.pdf')) {
                                            return (
                                                <div className="mt-2 border rounded-lg overflow-hidden">
                                                    <iframe
                                                        src={selectedApproval.document_url}
                                                        title="Pratinjau PDF"
                                                        className="w-full h-[500px]" // Set a fixed height for the PDF viewer
                                                    ></iframe>
                                                </div>
                                            );
                                        }
                                        // Return null if no preview is available for the file type
                                        return null;
                                    })()}
                                </div>

                            ) : (
                                <p className="text-sm text-gray-700">Tidak ada lampiran.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
