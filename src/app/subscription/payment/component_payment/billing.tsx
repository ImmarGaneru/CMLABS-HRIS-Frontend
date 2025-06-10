'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { FaEye } from "react-icons/fa";

interface ApiSubscrpition{
    package_type?: string;
    seats?: number;
    price_per_seat?: number;
}

interface ApiInvoice {
    id: string;
    total_amount: number;
    due_datetime: string;
    status: string;
    display_status: 'unpaid'|'paid'|'failed'|'overdue';
    xendit_invoice_id: string;
    invoice_url: string;
    deleted_at: string | null;
    user?: {
      workplace?: {
        subscription?: ApiSubscrpition;
      };
    };
    payments?: any[];
  }



export default function BillList() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [data, setData] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [token] = useState("8|DcN7dqelnE4js6rOn6g1VePt26YKixwa1DKrlBJJba4c3347");
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
                
                if (json && Array.isArray(json.data)) {
                    setData(json.data);
                    const mappedData = json.data.map((item:ApiInvoice) => {
                        const isOverdue = item.status === 'unpaid' && new Date(item.due_datetime) < new Date();
                        const subscription = item.user?.workplace?.subscription || {};
                        const dueDate = new Date(item.due_datetime);
                        const formattedMonth = dueDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                        const invoiceTitle = `Tagihan Langganan ${formattedMonth}`;

                        return {
                            id: item.id,
                            total_amount: item.total_amount,
                            due_datetime: item.due_datetime,
                            status: item.status,
                            display_status: isOverdue ? 'overdue' : item.status,
                            xendit_invoice_id: item.xendit_invoice_id,
                            invoice_url: item.invoice_url,
                            deleted_at: item.deleted_at,
    
                            invoice_title: invoiceTitle,
                            package_type: subscription.package_type || '-',
                            seats: subscription.seats ?? 0,
                            price_per_seat: subscription.price_per_seat ?? 0,
                        };
                    });

                    setData(mappedData);
                } else {
                    console.error('Data format tidak dikenali', json);
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
        total_amount: number;
        due_datetime: string;
        status: 'unpaid' | 'paid' | 'overdue';
        display_status: 'unpaid' | 'paid' | 'overdue';
        xendit_invoice_id: string;
        invoice_url: string;
        deleted_at: string | null;

        invoice_title: string;
        package_type: string;
        seats: number;
    };

    const statusFilters = [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
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
                accessorKey: "invoice_title",
                header: "Nama Tagihan",
                cell: info => (
                    <div className='capitalize font-bold'>{info.getValue() as string}</div>
                ),
            },
            {
                accessorKey: "package_type",
                header: "Paket",
                cell: info => (
                    <div className='capitalize'>{info.getValue() as string}</div>
                ),
            },
            {
                accessorKey: "seats",
                header: "Seat",
                cell: info => (
                    <div className="text-center">{info.getValue() as string}</div>
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
                        {new Date(info.getValue() as string).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </div>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: info => {
                    const status = info.getValue() as string;
                    const displayStatus = info.row.original.display_status;
                
                    const statusStyle: Record<string, string> = {
                        "paid": "bg-green-100 text-green-800",
                        "overdue": "bg-red-100 text-red-800",
                        "unpaid": "bg-yellow-100 text-yellow-800",
                        "failed": "bg-red-100 text-red-800",
                    };
                
                    return (
                        <div className="flex justify-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded ${statusStyle[status] ?? "bg-gray-100 text-gray-800"}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            {displayStatus === 'overdue' && (
                                <span className={`px-2 py-1 text-xs rounded ${statusStyle['overdue']}`}>
                                    Overdue
                                </span>
                            )}
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
                                // onClick={() => window.open(data.invoice_url, '_blank')} 
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
    
    //CONTOH
    // const dummyData: Bill[] = [
    //     {
    //         id: "01972105-bf1d-71e4-beee-3216431860c5",
    //         total_amount: 60000,
    //         due_datetime: "2025-06-01T12:00:00.000000Z",
    //         status: "unpaid",
    //         deleted_at: null,
    //         xendit_invoice_id: "68399b1100410a83e05ba067",
    //         invoice_url: "https://checkout-staging.xendit.co/web/68399b1100410a83e05ba067"
    //     }
    // ];

    const handleViewInvoice = (data: Bill) => {
        router.push(`/subscription/payment/invoice?id=${data.id}`);
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
            const searchText = filterText.toLowerCase();
            const matchesSearch = 
                item.invoice_title.toLowerCase().includes(searchText) ||
                item.package_type.toLowerCase().includes(searchText) ||
                item.status.toLowerCase().includes(searchText) ||
                item.display_status.toLowerCase().includes(searchText) ||
                item.seats.toString().includes(searchText) ||
                item.total_amount.toString().includes(searchText);
            
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
                        hasAdd={true}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        secondFilterValue={filterStatus}
                        onSecondFilterChange={setFilterStatus}
                        secondFilterOptions={statusFilters}
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