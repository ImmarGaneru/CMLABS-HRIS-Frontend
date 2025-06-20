'use client';
import BillList from "./payment/component_payment/billing";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from "@/lib/axios";
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Company {
  id: string;
  name: string;
  id_manager: string;
  id_subscription: string | null;
  address: string;
  deleted_at: string | null;
  has_used_trial: boolean;
}

interface Subscription {
  id: string;
  id_company: string;
  package_type: 'standard' | 'premium' | string;
  seats: number;
  price_per_seat: number;
  is_trial: boolean;
  trial_ends_at: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: 'active' | 'trial' | 'expired' | string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company: Company;
  is_cancelled: boolean;
}

interface PackageType {
  id: string;
  name: string;
  price_per_seat: number;
  max_seats: number;
  is_free: boolean;
  description: string;
}

interface SubscriptionForm {
  package_type: 'standard' | 'premium';
  seats: number;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [seats, setSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [lastSubscription, setLastSubscription] = useState<Subscription | null>(null);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const { handleSubmit } = useForm<SubscriptionForm>();
  const [invoices, setInvoices] = useState<any[]>([]);

  // Fetch package types when component mounts
  useEffect(() => {
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
  }, []);

  // Fetch active subscription and invoices
  useEffect(() => {
    const fetchCurrentAndInvoices = async () => {
      setIsLoading(true);
      try {
        const currentRes = await api.get('/admin/subscription/current');
        if (currentRes.data.meta?.success && currentRes.data.data) {
          setHasSubscription(true);
          const latestSubscription = currentRes.data.data;
          setLastSubscription(latestSubscription);
          // Fetch invoices
          const invoicesRes = await api.get('/admin/subscription/invoices');
          if (invoicesRes.data.meta?.success && Array.isArray(invoicesRes.data.data.data)) {
            // Map invoices to BillList format
            const mapped = invoicesRes.data.data.data.map((item: any) => {
              const dueDate = new Date(item.due_datetime);
              const formattedMonth = dueDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
              return {
                id: item.id,
                total_amount: item.total_amount,
                due_datetime: item.due_datetime,
                status: item.status,
                display_status: item.status,
                xendit_invoice_id: item.xendit_invoice_id,
                invoice_url: item.invoice_url,
                deleted_at: item.deleted_at,
                invoice_title: `Tagihan Langganan ${formattedMonth}`,
                package_type: item.package_type || '-',
                seats: item.seats ?? 0,
                payment_date: item.paid_at ?? null,
                payment_method: item.payment_method ?? '',
              };
            });
            setInvoices(mapped);
          }
        } else {
          setHasSubscription(false);
          setLastSubscription(null);
          setInvoices([]);
        }
      } catch (error) {
        setHasSubscription(false);
        setLastSubscription(null);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentAndInvoices();
  }, []);

  // Sementara
  useEffect(() => {
    console.log("Has subscription state changed:", hasSubscription);
  }, [hasSubscription]);
  

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    const packageInfo = packageTypes.find(p => p.id === selectedPackage);
    if (!packageInfo || packageInfo.is_free) return 0;
    return packageInfo.price_per_seat * seats;
  };

  const onSubmit = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/admin/subscription/subscribe', {
        id_package_type: selectedPackage,
        seats: seats,
      });

      if (response.data.meta?.success) {
        toast.success('Subscription created successfully');
        setHasSubscription(true);
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
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }
  

  if (hasSubscription || (lastSubscription && lastSubscription.is_cancelled)) {
    const pkg: any = lastSubscription?.package_type || {};
    return (
      <section className="flex flex-col px-2 py-4 gap-6 w-full h-fit">
        {/* Current Subscription Card */}
        <div className="bg-[#f8f8f8] rounded-xl shadow-md p-6 max-w-full">
          <h3 className="text-xl font-bold mb-6 text-[#1E3A5F]">Langganan Saat Ini</h3>
          <div className="bg-gray-200 p-6 grid grid-cols-2 gap-2 rounded-2xl border border-gray-400">
            <div>
              <span className="font-semibold">Paket:</span> {pkg?.name ?? '-'}
            </div>
            <div>
              <span className="font-semibold">Deskripsi:</span> {pkg?.description ?? '-'}
            </div>
            <div>
              <span className="font-semibold">Jumlah Seat:</span> {lastSubscription?.seats ?? '-'}
            </div>
            <div>
              <span className="font-semibold">Maksimal Seat:</span> {pkg?.max_seats ?? '-'}
            </div>
            <div>
              <span className="font-semibold">Harga per Seat:</span> {pkg?.is_free ? 'Free' : pkg?.price_per_seat !== undefined ? `Rp ${pkg.price_per_seat.toLocaleString()}` : '-'}
            </div>
            <div>
              <span className="font-semibold">Mulai:</span> {lastSubscription?.starts_at ? new Date(lastSubscription.starts_at).toLocaleString() : '-'}
            </div>
            <div>
              <span className="font-semibold">Berakhir:</span> {lastSubscription?.ends_at ? new Date(lastSubscription.ends_at).toLocaleString() : '-'}
            </div>
            <div>
              <span className="font-semibold">Status:</span> <span className="capitalize">{lastSubscription?.status ?? '-'}</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push('/subscription/change')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Change/Upgrade/Downgrade Subscription
            </button>
            <button
              onClick={async () => {
                if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
                setIsLoading(true);
                try {
                  const res = await api.post('/admin/subscription/cancel');
                  if (res.data.meta?.success) {
                    toast.success('Subscription cancelled.');
                    // Refresh state
                    window.location.reload();
                  } else {
                    toast.error(res.data.meta?.message || 'Failed to cancel subscription');
                  }
                } catch (err: any) {
                  toast.error(err?.response?.data?.meta?.message || 'Failed to cancel subscription');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
        <BillList invoices={invoices} />
      </section>
    );
  }

  return (
    <section className="bg-[#f8f8f8] flex flex-col px-2 py-4 gap-6 w-full h-full min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pilih Rencana Berlangganan Anda</h1>
        <p className="text-gray-600">Pilih paket terbaik untuk memenuhi kebutuhan perusahaan anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left: Package List */}
        <div>
          {packageTypes.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white relative rounded-lg border p-6 cursor-pointer transition-all shadow-md mb-6 ${
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
                  {pkg.is_free ? 'Free' : `Rp ${pkg.price_per_seat.toLocaleString()}`}
                </span>
                {!pkg.is_free && <span className="text-gray-600">/seat/month</span>}
              </div>
              <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
              <p className="text-sm text-gray-500 mb-6">Max seats: {pkg.max_seats}</p>
            </div>
          ))}
        </div>
        {/* Right: Tetapkan Pilihanmu Card */}
        <div className="flex items-start">
          {selectedPackage && (
            <div className="w-full bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Tetapkan Pilihanmu</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={packageTypes.find(p => p.id === selectedPackage)?.max_seats || 1000}
                    value={seats}
                    onChange={(e) => setSeats(Math.min(Math.max(1, parseInt(e.target.value) || 1), 
                      packageTypes.find(p => p.id === selectedPackage)?.max_seats || 1000))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Seats maksimal: {packageTypes.find(p => p.id === selectedPackage)?.max_seats || 1000}
                  </p>
                </div>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Mulai Berlangganan'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 