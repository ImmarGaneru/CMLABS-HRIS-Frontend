'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { FaEye } from "react-icons/fa";
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface CompanySubscription {
id: string;
packageType: {
    name: string;
    maxSeats: number;
    pricePerSeat: number;
};
seats: number;
startsAt: string;
endsAt: string;
status: 'trial' | 'active' | 'pending_upgrade' | 'pending_downgrade' | 'expired';
}

interface Invoice {
id: string;
totalAmount: number;
dueDatetime: string;
status: 'paid' | 'unpaid' | 'failed';
description: string;
payment?: Payment;
}

interface PackageType{
    id: string;
    name: string;
    max_seats: number;
    price_per_seat: number; //but in db it store like 10,000
    is_free: boolean;
    description: string;
}

interface Payment {
id_invoice: string;
amountPaid: number;
paymentMethod: string;
paymentDatetime: string;
}

interface ApiSubscrpition{
    id: string;
    package_type: string;
    seats: number;
    price_per_seat: number;
    is_cancelled: boolean;
    status: string;
}

interface ApiInvoice {
    id: string;
    total_amount: number;
    due_datetime: string;
    status: string;
    display_status: 'unpaid'|'paid'|'failed'|'overdue';
    xendit_invoice_id: string | null;
    invoice_url: string | null;
    deleted_at: string | null;
    user?: {
      workplace?: {
        subscription?: ApiSubscrpition;
      };
    };
    payments?: any[];
  }

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPackage: string;
    currentSeats: number;
    subscriptionId: string;
}

const UpgradeModal = ({ isOpen, onClose, currentPackage, currentSeats, subscriptionId }: UpgradeModalProps) => {
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [seats, setSeats] = useState(currentSeats);
    const [isLoading, setIsLoading] = useState(false);
    const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);

    // Fetch package types when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchPackageTypes = async () => {
                try {
                    const response = await api.get('/admin/subscription/packageTypes');
                    if (response.data.meta?.success) {
                        setPackageTypes(response.data.data.data || []);
                    }
                } catch (error) {
                    console.error('Error fetching package types:', error);
                    toast.error('Failed to load package types');
                }
            };
            fetchPackageTypes();
        }
    }, [isOpen]);

    const handleUpgrade = async () => {
        if (!selectedPackage) {
            toast.error('Please select a package');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Sending upgrade request:', {
                subscriptionId,
                package_type: selectedPackage,
                seats: seats
            });

            const response = await api.post(`/admin/subscription/${subscriptionId}/upgrade`, {
                package_type: selectedPackage,
                seats: seats
            });

            console.log('Upgrade response:', response.data);

            if (response.data.meta?.success) {
                toast.success('Upgrade request created successfully');
                if (response.data.data?.invoice?.invoice_url) {
                    window.open(response.data.data.invoice.invoice_url, '_blank');
                }
                onClose();
                window.location.reload();
            } else {
                throw new Error(response.data.meta?.message || 'Failed to process upgrade');
            }
        } catch (error: any) {
            console.error('Upgrade error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                config: error.config
            });
            
            const errorMessage = error.response?.data?.meta?.message 
                || error.response?.data?.message 
                || error.message 
                || 'Failed to process upgrade';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Upgrade Subscription</h2>
                <p className="text-gray-600 mb-4">Current package: {currentPackage}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {packageTypes.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                                selectedPackage === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            <h3 className="font-semibold">{pkg.name}</h3>
                            <p className="text-lg font-bold">
                                {pkg.is_free ? 'Free' : `Rp ${pkg.price_per_seat.toLocaleString()}/seat/month`}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                            <p className="text-xs text-gray-500">Max seats: {pkg.max_seats}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Seats
                    </label>
                    <input
                        type="number"
                        min={currentSeats}
                        max={packageTypes.find(p => p.id === selectedPackage)?.max_seats || 1000}
                        value={seats}
                        onChange={(e) => setSeats(Math.max(currentSeats, parseInt(e.target.value) || currentSeats))}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpgrade}
                        disabled={isLoading || !selectedPackage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : 'Upgrade Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface Bill {
    id: string;
    total_amount: number;
    due_datetime: string;
    status: 'paid' | 'unpaid' | 'failed' | 'overdue';
    display_status: 'unpaid' | 'paid' | 'overdue' | 'failed';
    xendit_invoice_id: string | null;
    invoice_url: string;
    deleted_at: string | null;
    invoice_title: string;
    package_type: string;
    seats: number;
    price_per_seat: number;
    payment_date: string | null;
    payment_method: string;
}

interface BillListProps {
    invoices: Bill[];
}

export default function BillList({ invoices }: BillListProps) {
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const statusFilters = [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
    ];

    const billColumns = useMemo<ColumnDef<Bill>[]>(() => [
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
            header: "Jumlah Seat",
            cell: info => (
                <div className="text-center">{info.getValue() as number}</div>
            ),
        },
        {
            accessorKey: "total_amount",
            header: "Total Biaya",
            cell: info => (
                <div className="flex justify-center">
                    Rp {(info.getValue() as number).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "due_datetime",
            header: "Tanggal Jatuh Tempo",
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
                    "failed": "bg-red-100 text-red-800"
                };
                return (
                    <div className="flex justify-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${statusStyle[displayStatus] || statusStyle['failed']}`}>
                            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
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
                            title="Lihat Faktur"
                            onClick={() => router.push(`/manager/subscription/invoice/${data.id}`)}
                            className={"border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"}
                        >
                            <FaEye />
                        </button>
                    </div>
                );
            },
        },
    ], []);

    // Filter data based on search text and status
    const filteredData = useMemo(() => {
        if (!Array.isArray(invoices)) {
            return [];
        }
        return invoices.filter((item) => {
            const searchText = filterText.toLowerCase();
            const matchesSearch =
                item.invoice_title.toLowerCase().includes(searchText) ||
                item.package_type.toLowerCase().includes(searchText) ||
                item.status.toLowerCase().includes(searchText) ||
                item.display_status.toLowerCase().includes(searchText) ||
                item.seats.toString().includes(searchText) ||
                item.total_amount.toString().includes(searchText);
            const matchesStatus = !filterStatus || item.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [invoices, filterText, filterStatus]);

    return (
        <div className="min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-2">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <DataTableHeader
                        title={'Daftar Tagihan'}
                        hasSearch={true}
                        hasSecondFilter={true}
                        hasAdd={false}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        secondFilterValue={filterStatus}
                        onSecondFilterChange={setFilterStatus}
                        secondFilterOptions={statusFilters}
                        importInputRef={fileInputRef}
                    />
                    <DataTable columns={billColumns} data={filteredData} />
                </div>
            </div>
        </div>
    );
}