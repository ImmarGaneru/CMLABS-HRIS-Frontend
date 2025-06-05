'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { IoArrowBackOutline } from "react-icons/io5";
import { InvoiceStatus, SubscriptionStatus } from '@/lib/enums';
import { getStatusClass } from '@/lib/utils';
import Button from '@/components/Button';

interface Payment {
  id: string;
  payment_code: string;
  amount_paid: number;
  currency: string;
  status: string;
  payment_datetime: string;
  payment_method: string;
}

interface Subscription {
  id: string;
  package_type: string;
  seats: number;
  price_per_seat: number;
  is_trial: boolean;
  trial_ends_at: string | null;
  ends_at: string | null;
  status: 'active' | 'trial' | 'expired';
}

interface InvoiceData {
  id: string;
  total_amount: number;
  due_datetime: string;
  status: InvoiceStatus;
  invoice_url: string;
  subscription: Subscription;
  payments: Payment[];
}

export default function Invoice() {
  const searchParams = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState("9|CmySPq9oHzxlzpNsWbCXLO6YKOrJhskTj3jOoGi4ff89bed8");

  // Fetch invoice by ID from API
  useEffect(() => {
    const invoiceId = searchParams.get('id');
    if (!invoiceId) {
      console.error("Invoice ID tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/api/admin/invoices/${invoiceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.meta?.success && json.data?.data) {
          const invoice = json.data.data;
        
          const formattedData: InvoiceData = {
            id: invoice.id || 'N/A',
            total_amount: typeof invoice.total_amount === 'number' ? invoice.total_amount : 0,
            due_datetime: invoice.due_datetime || new Date().toISOString(),
            status: invoice.status || InvoiceStatus.Unpaid,
            invoice_url: invoice.invoice_url || '#',
            subscription: invoice.user?.workplace?.subscription || {
              id: '',
              package_type: 'free',
              seats: 0,
              price_per_seat: 0,
              is_trial: false,
              trial_ends_at: null,
              ends_at: null,
              status: SubscriptionStatus.Expired,
            },
            payments: Array.isArray(invoice.payments) ? invoice.payments : [],
          };
        
          setInvoiceData(formattedData);
        }
      })
      .catch((err) => {
        console.error("Error fetching invoice:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoiceData) {
    return <div>Data faktur tidak ditemukan.</div>;
  }

  const { id, total_amount, due_datetime, status, invoice_url, subscription, payments } = invoiceData;

  const handlePaymentRedirect = () => {
    if(invoice_url){
      window.open(invoice_url, '_blank');
    }
  };

  return (
    <div className="flex flex-col px-6 py-6 gap-4 w-full h-fit bg-[#F8F8F8] rounded-2xl">
      {/* Header */}
      <div className="flex flex-row w-full items-center justify-between">
        <h3 className="text-2xl font-bold text-blue-950">Detail Tagihan</h3>
        <Button onClick={() => window.history.back()} variant='redirectButton'>
          <IoArrowBackOutline size={20} />
          <span className="font-medium">Kembali</span>
        </Button>
      </div>

      {/* Detail Tagihan */}
      <div className="bg-white p-6 rounded-lg shadow-sm text-[#141414]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bagian Kiri - Rincian Faktur */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Rincian Tagihan</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Invoice ID:</span> {id}</p>
              <p><span className="font-medium">Jumlah:</span> Rp {total_amount.toLocaleString()}</p>
              <p><span className="font-medium">Tanggal Jatuh Tempo:</span> {new Date(due_datetime).toLocaleDateString()}</p>
                {/* Status Faktur */}
                <div>
                  <span className="font-medium">Status Faktur:</span>{' '}
                  <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusClass(status)}`}>
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                  </span>
                </div>

                {/* Status Langganan */}
                {subscription && (
                  <div>
                    <span className="font-medium">Status Langganan:</span>{' '}
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusClass(subscription.status as SubscriptionStatus)}`}>
                      {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1)}
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Bagian Kanan - Informasi Langganan */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Langganan Terkait</h4>
            <div className="space-y-2">
            <p><span className="font-medium">Jumlah:</span> Rp {total_amount.toLocaleString()}</p>
            <p><span className="font-medium">Tanggal Jatuh Tempo:</span> 
              {due_datetime ? new Date(due_datetime).toLocaleDateString() : 'Belum ditentukan'}
            </p>

            {subscription && (
              <>
                <p><span className="font-medium">Paket:</span> {subscription.package_type}</p>
                <p><span className="font-medium">Jumlah Seat:</span> {subscription.seats}</p>
                <p><span className="font-medium">Harga per Seat:</span> Rp {subscription.price_per_seat.toLocaleString()}</p>
                <p><span className="font-medium">Status:</span> {subscription.status}</p>
              </>
            )}
            </div>
          </div>
        </div>

        {/* Pembayaran */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Pembayaran</h4>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between">
                    <p><span className="font-medium">Metode:</span> {payment.payment_method}</p>
                    <p><span className="font-medium">Jumlah:</span> Rp {payment.amount_paid.toLocaleString()}</p>
                  </div>
                  <p><span className="font-medium">Tanggal:</span> {new Date(payment.payment_datetime).toLocaleString()}</p>
                  <p><span className="font-medium">Status:</span> {payment.status}</p>
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
        </div>
      </div>
    </div>
  );
}