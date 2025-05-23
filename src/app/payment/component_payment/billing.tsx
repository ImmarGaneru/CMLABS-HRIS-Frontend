'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { FaEye } from "react-icons/fa";

export default function BillList() {
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    type Bill = {
        id: string;
        title: string;
        plan: string;
        seat: number;
        price: number;
        dueDate: string;
        status: 'unpaid' | 'paid' | 'overdue';
    };

    const statusFilters = [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
    ];

    const billColumns = useMemo<ColumnDef<Bill>[]>(
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
                accessorKey: "title",
                header: "Title",
                cell: info => (
                    <div className="truncate w-[200px] font-bold">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "plan",
                header: "Plan",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "seat",
                header: "Seat",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as number} Seat
                    </div>
                ),
            },
            {
                accessorKey: "price",
                header: "Price",
                cell: info => (
                    <div className="flex justify-center">
                        Rp {(info.getValue() as number).toLocaleString()}/seat
                    </div>
                ),
            },
            {
                accessorKey: "dueDate",
                header: "Due Date",
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
                        "paid": "bg-green-100 text-green-800",
                        "overdue": "bg-red-100 text-red-800",
                        "unpaid": "bg-yellow-100 text-yellow-800",
                    };
                    return (
                        <div className="flex justify-center">
                            <span className={`px-2 py-1 text-xs rounded ${statusStyle[status] ?? "bg-gray-100 text-gray-800"}`}>
                                {status}
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
                                onClick={() => handleViewInvoice(data)}
                                className={"border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"}
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

    const dummyData: Bill[] = [
        {
            id: 'INV-001',
            title: 'Tagihan Maret 2025',
            plan: 'Premium',
            seat: 280,
            price: 18000,
            dueDate: '03/04/2025',
            status: 'unpaid'
        },
        {
            id: 'INV-002',
            title: 'Tagihan Februari 2025',
            plan: 'Premium',
            seat: 256,
            price: 18000,
            dueDate: '03/03/2025',
            status: 'overdue'
        },
        {
            id: 'INV-003',
            title: 'Tagihan Januari 2025',
            plan: 'Premium',
            seat: 200,
            price: 18000,
            dueDate: '03/02/2025',
            status: 'paid'
        }
    ];

    const handleViewInvoice = (data: Bill) => {
        const invoiceData = {
            ...data,
            amount: data.seat * data.price
        };
        router.push(`/payment/invoice?data=${encodeURIComponent(JSON.stringify(invoiceData))}`);
    };

    // Filter data based on search text, status and history toggle
    const filteredData = useMemo(() => {
        return dummyData.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(filterText.toLowerCase()) ||
                                item.plan.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = !filterStatus || item.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [filterText, filterStatus, showHistory]);

    return (
        <div className="min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <DataTableHeader
                        title={showHistory ? 'Payment History' : 'App Billing'}
                        hasSearch={true}
                        hasSecondFilter={true}
                        hasHistoryToggle={true}
                        hasExport={true}
                        hasImport={true}
                        hasAdd={true}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        secondFilterValue={filterStatus}
                        onSecondFilterChange={setFilterStatus}
                        secondFilterOptions={statusFilters}
                    />
                    <DataTable columns={billColumns} data={filteredData}/>
                </div>
            </div>
        </div>
    );
}