'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

export default function BillList() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [data, setData] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [token] = useState("33|5LDN0e8AskvPD1suamMTkidN7SYfUSp5CezqlTjp5f8d22dc");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/admin/invoices`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 403) {
                    router.push('/unauthorized');
                    return;
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const json = await response.json();
                console.log('Response data:', json); // Debug log
                
                // Check if the response is an array
                if (Array.isArray(json)) {
                    setData(json);
                } else if (json.data && Array.isArray(json.data)) {
                    // If the API returns { data: [...] }
                    setData(json.data);
                } else {
                    console.error('Unexpected API response format:', json);
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, router]);

    type Bill = {
        id: string;
        // title: string;
        total_amount: number;
        due_datetime: string;
        status: 'unpaid' | 'paid' | 'overdue';
        deleted_at: string | null;
        xendit_invoice_id: string;
        invoice_url: string;
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
                accessorKey: "id",
                header: "Invoice ID",
                cell: info => (
                    <div className="truncate w-[200px] font-bold">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "total_amount",
                header: "Total Amount",
                cell: info => (
                    <div className="flex justify-center">
                        Rp {(info.getValue() as number).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: "due_datetime",
                header: "Due Date",
                cell: info => (
                    <div className="flex justify-center">
                        {new Date(info.getValue() as string).toLocaleDateString()}
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
                                title="View Invoice"
                                onClick={() => window.open(data.invoice_url, '_blank')}
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
    
    //CONTOH
    const dummyData: Bill[] = [
        {
            id: "01972105-bf1d-71e4-beee-3216431860c5",
            total_amount: 60000,
            due_datetime: "2025-06-01T12:00:00.000000Z",
            status: "unpaid",
            deleted_at: null,
            xendit_invoice_id: "68399b1100410a83e05ba067",
            invoice_url: "https://checkout-staging.xendit.co/web/68399b1100410a83e05ba067"
        }
    ];

    const handleViewInvoice = (data: Bill) => {
        router.push(`/payment/invoice?data=${encodeURIComponent(JSON.stringify(data))}`);
    };

    // Export to Excel
    const handleExport = () => {
        const dataToExport = filteredData.map(bill => ({
            'Invoice ID': bill.id,
            'Total Amount': `Rp ${bill.total_amount.toLocaleString()}`,
            'Due Date': new Date(bill.due_datetime).toLocaleDateString(),
            'Status': bill.status,
            'Xendit Invoice ID': bill.xendit_invoice_id
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billing Data");
        XLSX.writeFile(workbook, "billing_data.xlsx");
    };

    // Import from Excel
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                if (!data) throw new Error("File kosong");

                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json<Bill>(worksheet);
                console.log("Imported data:", jsonData);
                alert("Import berhasil. Lihat console untuk data.");
            } catch (error) {
                console.error("Error importing file:", error);
                alert("Error mengimpor file. Pastikan format benar.");
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleHistoryToggle = () => {
        setShowHistory(!showHistory);
    };

    // Filter data based on search text, status and history toggle
    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return [];
        }
        
        return data.filter((item) => {
            const matchesSearch = item.id.toLowerCase().includes(filterText.toLowerCase());
            const matchesStatus = !filterStatus || item.status === filterStatus;
            // If showing history, only show paid invoices
            const matchesHistory = !showHistory || item.status === 'paid';
            return matchesSearch && matchesStatus && matchesHistory;
        });
    }, [data, filterText, filterStatus, showHistory]);

    return (
        <div className="min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <DataTableHeader
                        title={showHistory ? 'Payment History' : 'App Billing'}
                        hasSearch={true}
                        hasSecondFilter={true}
                        hasHistoryToggle={true}
                        hasAdd={true}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        secondFilterValue={filterStatus}
                        onSecondFilterChange={setFilterStatus}
                        secondFilterOptions={statusFilters}
                        onHistoryToggle={handleHistoryToggle}
                        showHistory={showHistory}
                        importInputRef={fileInputRef}
                    />
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
                        </div>
                    ) : (
                        <DataTable columns={billColumns} data={filteredData}/>
                    )}
                </div>
            </div>
        </div>
    );
}