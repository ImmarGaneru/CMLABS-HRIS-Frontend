'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { FaEye, FaArrowUp } from "react-icons/fa";
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { Check } from "lucide-react";

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

    const packages = [
        {
            id: 'standard',
            name: 'Standard',
            price: 10000,
            features: [
                'Up to 100 seats',
                'Advanced features',
                'Priority support',
                'Custom integrations',
            ],
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 25000,
            features: [
                'Up to 1000 seats',
                'All features',
                '24/7 support',
                'Custom integrations',
                'Dedicated account manager',
            ],
        },
    ];

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
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                                selectedPackage === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            <h3 className="font-semibold">{pkg.name}</h3>
                            <p className="text-lg font-bold">Rp {pkg.price.toLocaleString()}/seat/month</p>
                            <ul className="mt-2 text-sm">
                                {pkg.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
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
                        max={selectedPackage === 'standard' ? 100 : 1000}
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

export default function BillList() {
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [data, setData] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastSubscription, setLastSubscription] = useState<ApiSubscrpition | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState<ApiSubscrpition | null>(null);
    const [showNewSubscription, setShowNewSubscription] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [seats, setSeats] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const packages = [
        {
            id: 'standard',
            name: 'Standard',
            price: 10000,
            features: [
                'Up to 100 seats',
                'Advanced features',
                'Priority support',
                'Custom integrations',
            ],
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 25000,
            features: [
                'Up to 1000 seats',
                'All features',
                '24/7 support',
                'Custom integrations',
                'Dedicated account manager',
            ],
        },
    ];

    const calculateTotalPrice = () => {
        if (!selectedPackage || selectedPackage === 'free') return 0;
        const packageInfo = packages.find(p => p.id === selectedPackage);
        return packageInfo ? packageInfo.price * seats : 0;
    };

    const handleNewSubscription = async () => {
        if (!selectedPackage) {
            toast.error('Please select a package');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.post('/admin/subscription', {
                package_type: selectedPackage,
                seats: seats,
            });

            if (response.data.meta?.success) {
                toast.success('Subscription created successfully');
                setShowNewSubscription(false);
                window.location.reload(); // Reload to show updated subscription status
            } else {
                throw new Error('Failed to create subscription');
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.meta?.message 
                || error.message 
                || 'Failed to create subscription';
            toast.error(errorMessage);
            console.error('Error creating subscription:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [invoicesResponse, subscriptionResponse] = await Promise.all([
                    api.get(`/admin/invoices`),
                    api.get(`/admin/subscription`)
                ]);
                
                if (invoicesResponse.status === 403 || subscriptionResponse.status === 403) {
                    router.push('/unauthorized');
                    return;
                }
                
                if (!invoicesResponse.data.meta?.success) {
                    throw new Error(`HTTP error! status: ${invoicesResponse.status}`);
                }

                // Get the last subscription
                if (subscriptionResponse.data.meta?.success && Array.isArray(subscriptionResponse.data.data)) {
                    const subscriptions = subscriptionResponse.data.data;
                    if (subscriptions.length > 0) {
                        setLastSubscription(subscriptions[0]);
                        setCurrentSubscription(subscriptions[0]);
                    }
                }
                
                const invoices = invoicesResponse.data.data as ApiInvoice[];
                
                const mappedData = invoices.map((item:ApiInvoice) => {
                    const isOverdue = item.status === 'unpaid' && new Date(item.due_datetime) < new Date();
                    const subscription = item.user?.workplace?.subscription || {
                        package_type: '-',
                        seats: 0,
                        price_per_seat: 0,
                    };

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

                setData(mappedData as Bill[]);
                  
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

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
        price_per_seat:number;
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

    const handleUpgradeClick = () => {
        if (currentSubscription) {
            setIsUpgradeModalOpen(true);
        }
    };

    if (showNewSubscription) {
        return (
            <section className="bg-[#f8f8f8] flex flex-col px-2 py-4 gap-6 w-full h-full min-h-screen">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Pilih Rencana Berlangganan Anda</h1>
                    <p className="text-gray-600">Pilih paket terbaik untuk memenuhi kebutuhan perusahaan anda</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`bg-white relative rounded-lg border p-6 cursor-pointer transition-all shadow-md ${
                                selectedPackage === pkg.id
                                    ? 'border-blue-500 shadow-lg scale-105'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            {selectedPackage === pkg.id && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                            <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    Rp {pkg.price.toLocaleString()}
                                </span>
                                <span className="text-gray-600">/seat/month</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                                {pkg.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm">
                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {selectedPackage && (
                    <div className="max-w-md mx-auto w-full bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">Tetapkan Pilihanmu</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah Seats
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={selectedPackage === 'standard' ? 100 : 1000}
                                    value={seats}
                                    onChange={(e) => setSeats(Math.min(Math.max(1, parseInt(e.target.value) || 1), 
                                        selectedPackage === 'standard' ? 100 : 1000))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Seats maksimal: {selectedPackage === 'standard' ? 100 : 1000}
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Harga tiap seat</span>
                                    <span>Rp {packages.find(p => p.id === selectedPackage)?.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total harga</span>
                                    <span>Rp {calculateTotalPrice().toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowNewSubscription(false)}
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Kembali
                                </button>
                                <button
                                    onClick={handleNewSubscription}
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Processing...' : 'Mulai Berlangganan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        );
    }

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
                    {currentSubscription?.status === 'active' && !currentSubscription.is_cancelled && (
                        <button
                            onClick={handleUpgradeClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
                        >
                            <FaArrowUp />
                            Upgrade Subscription
                        </button>
                    )}
                    {lastSubscription?.is_cancelled && (
                        <button
                            onClick={() => setShowNewSubscription(true)}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        >
                            Buat Langganan Baru
                        </button>
                    )}
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
                        </div>
                    ) : (
                        <DataTable columns={billColumns} data={filteredData}/>
                    )}
                </div>
            </div>

            {currentSubscription && (
                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    currentPackage={currentSubscription.package_type}
                    currentSeats={currentSubscription.seats}
                    subscriptionId={currentSubscription.id}
                />
            )}
        </div>
    );
}