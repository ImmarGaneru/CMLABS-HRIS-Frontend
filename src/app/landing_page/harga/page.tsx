'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for small businesses just getting started',
    features: [
      'Up to 5 employees/seats',
      'Basic attendance tracking',
      'Basic reporting',
      'Email support',
      '1 month data retention',
    ],
    buttonText: 'Get Started',
    popular: false,
    gradient: 'from-gray-100 to-gray-200',
  },
  {
    name: 'Standard',
    price: '10000',
    description: 'Ideal for growing businesses',
    features: [
      'Up to 100 employees',
      'Advanced attendance tracking',
      'Advanced reporting & analytics',
      'Priority email support',
      '6 months data retention',
      'Custom branding',
      'API access',
    ],
    buttonText: 'Start Free Trial',
    popular: true,
    gradient: 'from-[#7CA5BF] to-[#1E3A5F]/20',
  },
  {
    name: 'Premium',
    price: '15000',
    description: 'For large organizations with specific needs',
    features: [
      'Up to 200 employees',
      'Custom attendance solutions',
      'Advanced analytics & insights',
      '24/7 priority support',
      'Unlimited data retention',
      'Custom branding',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    buttonText: 'Start Free Trial',
    popular: false,
    gradient: 'from-gray-100 to-gray-200',
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] text-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Choose the Perfect Plan for Your Business
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto">
          Flexible pricing plans designed to help you manage your workforce effectively
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl overflow-hidden shadow-xl border ${
                plan.popular ? 'border-[#1E3A5F] scale-[1.03] md:-translate-y-3' : 'border-gray-200'
              } transition-transform`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${plan.gradient} p-8`}>
                <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-[#1E3A5F]">
                    {plan.price === 'Custom' ? plan.price : `Rp ${parseInt(plan.price).toLocaleString()}`}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="ml-1 text-sm text-[#1E3A5F]">/seat/month</span>
                  )}
                </div>
                <p className="text-[#1E3A5F] font-medium">{plan.description}</p>
                <button
                  onClick={() => router.push('/auth/register')}
                  className={`mt-6 w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white text-[#1E3A5F] hover:bg-gray-100'
                      : 'bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Features */}
              <div className="bg-white p-8 h-full">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-700 text-sm">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F]">Frequently Asked Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            {
              q: 'Can I change plans later?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes, we offer a 14-day free trial on our Professional plan. No credit card required.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, bank transfers, and PayPal.',
            },
            {
              q: 'Do you offer refunds?',
              a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
            },
          ].map((faq, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
