'use client';
import BillList from "./payment/component_payment/billing";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from "@/lib/axios";

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

interface SubscriptionForm {
  package_type: 'standard' | 'premium';
  seats: number;
}

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

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [seats, setSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [lastSubscription, setLastSubscription] = useState<Subscription | null>(null);
  const { handleSubmit } = useForm<SubscriptionForm>();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await api.get('/admin/subscription');

        if (response.data.meta?.success === true && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const subscriptions = response.data.data;
          const latestSubscription = subscriptions[0];
          setLastSubscription(latestSubscription);
          
          const hasActiveOrValidTrial = subscriptions.some((subscription: Subscription) => {
            const now = new Date();
            const trialEnds = subscription.trial_ends_at ? new Date(subscription.trial_ends_at) : null;
            const isCancelled = subscription.is_cancelled;
  
            return (
              (subscription.status === 'active' && !isCancelled) ||
              (subscription.status === 'trial' && trialEnds && trialEnds > now)
            );
          });

          setHasSubscription(hasActiveOrValidTrial);
        } else {
          setHasSubscription(false);
          setLastSubscription(null);
          console.log("No active subscription found");
        }
      
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
        setLastSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  // Sementara
  useEffect(() => {
    console.log("Has subscription state changed:", hasSubscription);
  }, [hasSubscription]);
  

  const calculateTotalPrice = () => {
    if (!selectedPackage || selectedPackage === 'free') return 0;
    const packageInfo = packages.find(p => p.id === selectedPackage);
    return packageInfo ? packageInfo.price * seats : 0;
  };

  const onSubmit = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/admin/subscription', {
        package_type: selectedPackage,
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F]"></div>
      </div>
    );
  }
  

  if (hasSubscription || (lastSubscription && lastSubscription.is_cancelled)) {
    return (
      <section className="flex flex-col px-2 py-4 gap-6 w-full h-fit">
        <BillList />
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
                max={selectedPackage === 'free' ? 5 : selectedPackage === 'standard' ? 100 : 1000}
                value={seats}
                onChange={(e) => setSeats(Math.min(Math.max(1, parseInt(e.target.value) || 1), 
                  selectedPackage === 'free' ? 5 : selectedPackage === 'standard' ? 100 : 1000))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Seats maksimal: {selectedPackage === 'free' ? 5 : selectedPackage === 'standard' ? 100 : 1000}
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
    </section>
  );
} 