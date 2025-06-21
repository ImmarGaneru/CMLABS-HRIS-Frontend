'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBackOutline } from "react-icons/io5";
import { InvoiceStatus, SubscriptionStatus } from '@/lib/enums';
import Button from '@/components/Button';
import api from '@/lib/axios';
import { FaArrowUp } from 'react-icons/fa';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface PackageType {
  id: string;
  name: string;
  description: string;
  max_seats: number;
  price_per_seat: number;
  is_free: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

interface Subscription {
  id: string;
  package_type: PackageType;
  seats: number;
  starts_at?: string;
  ends_at?: string | null;
  status: 'active' | 'trial' | 'expired';
  is_trial?: boolean;
  trial_ends_at?: string | null;
  is_cancelled?: boolean;
}

interface Payment {
  id: string;
  payment_code: string;
  amount_paid: number;
  currency: string;
  status: string;
  payment_datetime: string;
  payment_method: string;
}

interface InvoiceData {
  id: string;
  total_amount: number;
  due_datetime: string;
  status: InvoiceStatus;
  display_status: 'paid'|'unpaid'|'overdue';
  xendit_invoice_id: string;
  invoice_url: string;
  subscription: Subscription;
  payment: Payment[];
}

interface DailyUsage {
  date: string;
  daily_cost: number;
}

export default function Invoice({ id: propId }: { id?: string }) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const router = useRouter();

  // Fetch invoice by ID from API
  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const invoiceId = propId;
        if (!invoiceId) {
          throw new Error("Invoice ID tidak ditemukan di URL");
        }
        const response = await api.get(`/admin/subscription/invoices/${invoiceId}`);
        if (response.status === 403) {
          window.location.href = '/unauthorized';
          return;
        }
        if (!response.data.meta?.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const item = response.data.data.data;
        const isOverdue = item.status === 'unpaid' && new Date(item.due_datetime) < new Date();
        // Defensive fallback for missing fields
        const subscription = item.subscription || {
          id: '',
          package_type: {
            id: '',
            name: '-',
            description: '',
            max_seats: 0,
            price_per_seat: 0,
            is_free: false,
          },
          seats: 0,
          status: 'expired',
        };
        const formattedData: InvoiceData = {
          id: item.id || 'N/A',
          total_amount: typeof item.total_amount === 'number' ? item.total_amount : 0,
          due_datetime: item.due_datetime || new Date().toISOString(),
          status: item.status || 'unpaid',
          display_status: isOverdue ? 'overdue' : item.status,
          xendit_invoice_id: item.xendit_invoice_id || '',
          invoice_url: item.invoice_url || '#',
          subscription: {
            id: subscription.id || '',
            package_type: subscription.package_type,
            seats: subscription.seats ?? 0,
            starts_at: subscription.starts_at,
            ends_at: subscription.ends_at,
            status: subscription.status || 'expired',
            is_trial: subscription.is_trial,
            trial_ends_at: subscription.trial_ends_at,
            is_cancelled: subscription.is_cancelled,
          },
          payment: Array.isArray(item.payment) ? item.payment : [],
        };
        setInvoiceData(formattedData);
        // Fetch daily usage if subscription exists
        if (subscription.id) {
          setLoadingUsage(true);
          try {
            const usageRes = await api.get(`/admin/subscription/${subscription.id}`);
            if (usageRes.data.meta?.success) {
              setDailyUsage(Array.isArray(usageRes.data.data.data) ? usageRes.data.data.data : []);
            }
          } catch (e) {
            setDailyUsage([]);
          } finally {
            setLoadingUsage(false);
          }
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setInvoiceData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [propId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
      </div>
    );
  }

  if (!propId) {
    return <div>Invoice ID tidak ditemukan di URL.</div>;
  }

  if (!invoiceData) {
    return <div>Data faktur tidak ditemukan.</div>;
  }

  const { id, total_amount, due_datetime, status, display_status, invoice_url, subscription, payment } = invoiceData;

  const handlePaymentRedirect = () => {
    if (invoice_url) {
      window.open(invoice_url, '_blank');
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const response = await api.post(`/admin/subscription/${subscription.id}/cancel`);
      if (response.status === 200) {
        setIsCancelDialogOpen(false);
        window.location.reload();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSubsClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <div className="flex flex-col px-6 py-6 gap-4 w-full h-fit bg-[#F8F8F8] rounded-2xl">
        {/* Header */}
        <div className="flex flex-row w-full items-center justify-between">
          <h3 className="text-2xl font-bold text-blue-950">Detail Tagihan</h3>
          <div className="flex gap-2">
            {subscription?.status === 'active' && !subscription.is_cancelled && (
              <button
                onClick={() => router.push('/manager/subscription')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
              >
                <FaArrowUp />
                Upgrade Plan
              </button>
            )}
            <Button onClick={() => window.history.back()} variant='redirectButton'>
              <IoArrowBackOutline size={20} />
              <span className="font-medium">Kembali</span>
            </Button>
          </div>
        </div>

        {/* Detail Tagihan */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-[#141414]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bagian Kiri - Rincian Faktur */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Rincian Tagihan</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Invoice ID:</span> {id}</p>
                <p><span className="font-medium">Tanggal Jatuh Tempo:</span> {new Date(due_datetime).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                {/* Status Faktur */}
                <div>
                  <span className="font-medium">Status Faktur:</span>{' '}
                  <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusClass(status)}`}>
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                  </span>
                  {display_status === 'overdue' && (
                    <span className={`inline-block ml-2 px-2 py-1 text-xs rounded ${getStatusClass(display_status)}`}>
                      {display_status.charAt(0).toUpperCase() + display_status.slice(1)}
                    </span>
                  )}
                </div>
                {/* Status Langganan */}
                {subscription && (
                  <div>
                    <span className="font-medium">Status Langganan:</span>{' '}
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getSubsClass(subscription.status as SubscriptionStatus)}`}>
                      {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Bagian Kanan - Informasi Langganan */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Rincian Langganan</h4>
              <div className="space-y-2">
                {subscription && (
                  <>
                    <p><span className="font-medium">Paket:</span> {subscription.package_type?.name}</p>
                    <p><span className="font-medium">Deskripsi:</span> {subscription.package_type?.description}</p>
                    <p><span className="font-medium">Jumlah Seat:</span> {subscription.seats}</p>
                    <p><span className="font-medium">Harga per Seat:</span> Rp {subscription.package_type?.price_per_seat?.toLocaleString()}</p>
                    <p><span className="font-medium">Durasi:</span> {subscription.starts_at ? `${new Date(subscription.starts_at).toLocaleDateString('id-ID')} - ${subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString('id-ID') : '-'}` : '-'}</p>
                  </>
                )}
                <p className='font-bold'><span>Total:</span> Rp {total_amount.toLocaleString()}</p>
              </div>
              {subscription.status === 'active' && (
                <button
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
          {/* Pembayaran */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Pembayaran</h4>
            {payment.length > 0 ? (
              <div className="space-y-4">
                {payment.map((pay) => (
                  <div key={pay.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between">
                      <p><span className="font-medium">Metode:</span> {pay.payment_method}</p>
                      <p><span className="font-medium">Jumlah:</span> Rp {pay.amount_paid.toLocaleString()}</p>
                    </div>
                    <p><span className="font-medium">Tanggal:</span> {new Date(pay.payment_datetime).toLocaleString()}</p>
                    <p><span className="font-medium">Status:</span> {pay.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-700">Belum ada pembayaran untuk faktur ini.</p>
                <button
                  onClick={handlePaymentRedirect}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}
            {/* Info overdue tambahan (opsional) */}
            {display_status === 'overdue' && (
              <div className="mt-4 text-sm text-red-600">
                ⚠️ Invoice ini belum dibayar dan sudah lewat dari tanggal jatuh tempo.
              </div>
            )}
          </div>
          {/* Daily Usage Section */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Rincian Penggunaan Harian</h4>
            {loadingUsage ? (
              <div>Loading daily usage...</div>
            ) : dailyUsage.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Tanggal</th>
                      <th className="px-4 py-2 border">Biaya Harian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyUsage.map((usage, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 border">{new Date(usage.date).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-2 border">Rp {usage.daily_cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>Tidak ada data penggunaan harian.</div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Your subscription will be cancelled immediately and you won't be charged for the next billing cycle.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="primary"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}