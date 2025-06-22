'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Check } from 'lucide-react';

interface PackageType {
  id: string;
  name: string;
  price_per_seat: number;
  max_seats: number;
  is_free: boolean;
  description: string;
}

interface Subscription {
  id: string;
  package_type: PackageType;
  seats: number;
  starts_at: string;
  ends_at: string;
  status: string;
}

export default function ChangeSubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState<Subscription | null>(null);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [seats, setSeats] = useState<number>(1);
  const [inputSeats, setInputSeats] = useState('1');
  const [showSeatsWarning, setShowSeatsWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subRes, pkgRes] = await Promise.all([
          api.get('/admin/subscription/current'),
          api.get('/admin/subscription/packageTypes'),
        ]);
        if (subRes.data.meta?.success && subRes.data.data) {
          setCurrent(subRes.data.data);
          setSelectedPackage(subRes.data.data.package_type?.id || null);
          setSeats(subRes.data.data.seats || 1);
          setInputSeats(String(subRes.data.data.seats || 1));
        }
        if (pkgRes.data.meta?.success) {
          setPackages(pkgRes.data.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !seats) {
      toast.error('Please select a package and seat count');
      return;
    }

    // Add a frontend validation check for immediate and clear feedback
    const selectedPackageInfo = packages.find(p => p.id === selectedPackage);
    if (selectedPackageInfo && seats > selectedPackageInfo.max_seats) {
        toast.error(`Jumlah seat tidak boleh melebihi batas paket (maksimal: ${selectedPackageInfo.max_seats})`, {
            // autoClose: 5000,
            // position: "top-right",
            // Custom style to make it more prominent
            // style: {
            //   border: '1px solid #D8000C',
            //   padding: '16px',
            //   color: '#D8000C',
            //   fontWeight: 'bold',
            //   backgroundColor: '#F8F8F8',
            // },
        });
        return; // Stop the submission if seats exceed max
    }

    setSubmitting(true);
    try {
      const res = await api.post('/admin/subscription/request-change', {
        id_new_package_type: selectedPackage,
        new_seats: seats,
      });
      if (res.data.meta?.success) {
        toast.success('Perubahan Subscription berhasil dilakukan!');
        router.push('/manager/subscription');
      } else {
        toast.error(res.data.meta?.message || 'Failed to request change');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.meta?.message || 'Failed to request change');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSeats(value);
    
    const numValue = parseInt(value) || 1;
    const maxSeats = packages.find(p => p.id === selectedPackage)?.max_seats || 1000;
    
    setSeats(numValue);
    
    setShowSeatsWarning(numValue > maxSeats);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <ToastContainer />
      <div className='flex justify-between mb-6'>
        <h2 className="text-2xl font-bold text-[#1E3A5F]">Change Subscription</h2>
        <button
            onClick={() => router.push("/manager/subscription")}
            className="flex items-center bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
        </button>
      </div>
      {current && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <div className="mb-2"><span className="font-semibold">Current Package:</span> {current.package_type?.name}</div>
          <div className="mb-2"><span className="font-semibold">Seats:</span> {current.seats}</div>
          <div className="mb-2"><span className="font-semibold">Status:</span> <span className="capitalize">{current.status}</span></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select New Package</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white border rounded-lg p-4 cursor-pointer transition-all shadow-sm relative ${selectedPackage === pkg.id ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => {
                  setSelectedPackage(pkg.id);
                  setSeats(1);
                  setInputSeats('1');
                  setShowSeatsWarning(false);
                }}
              >
                {selectedPackage === pkg.id && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1">{pkg.name}</h3>
                <div className="mb-2">
                  <span className="text-xl font-bold">{pkg.is_free ? 'Free' : `Rp ${pkg.price_per_seat.toLocaleString()}`}</span>
                  {!pkg.is_free && <span className="text-gray-600">/seat/month</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                <p className="text-xs text-gray-500">Max seats: {pkg.max_seats}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Seats</label>
          <input
            type="number"
            min={1}
            value={inputSeats}
            onChange={handleSeatsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          />
          {showSeatsWarning && (
            <p className="text-sm text-orange-600 mt-1 font-medium">
              ⚠️ Warning: This number exceeds the maximum capacity of {packages.find(p => p.id === selectedPackage)?.max_seats || 1000} seats
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Seats maksimal: {packages.find(p => p.id === selectedPackage)?.max_seats || 1000}</p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? 'Processing...' : 'Submit Change Request'}
        </button>
      </form>
    </section>
  );
} 