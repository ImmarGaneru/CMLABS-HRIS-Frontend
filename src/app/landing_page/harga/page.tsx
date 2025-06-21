'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      '1 month data retention'
    ],
    buttonText: 'Get Started',
    popular: false,
    gradient: 'from-gray-100 to-gray-200'
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
      'API access'
    ],
    buttonText: 'Start Free Trial',
    popular: true,
    gradient: 'from-[#7CA5BF] to-[#1E3A5F]/20'
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
      'SLA guarantee'
    ],
    buttonText: 'Start Free Trial',
    popular: false,
    gradient: 'from-gray-100 to-gray-200'
  }
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose the Perfect Plan for Your Business
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Flexible pricing plans designed to help you manage your workforce effectively
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden shadow-xl ${
                plan.popular ? 'transform md:-translate-y-4' : ''
              }`}
            >
              <div className={`bg-gradient-to-r ${plan.gradient} p-8`}>
                <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-[#1E3A5F]">
                    {plan.price === 'Custom' ? plan.price : `Rp ${plan.price}`}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-[#1E3A5F] ml-2">/seat/month</span>
                  )}
                </div>
                <p className="text-[#1E3A5F] mb-6">{plan.description}</p>
                <button
                  onClick={() => router.push('/auth/register')}
                  className={`w-full py-3 px-6 rounded-full font-medium ${
                    plan.popular
                      ? 'bg-white text-[#1E3A5F] hover:bg-gray-100'
                      : 'bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90'
                  } transition-colors`}
                >
                  {plan.buttonText}
                </button>
              </div>
              <div className="bg-white p-8 h-full">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-[#1E3A5F] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#1E3A5F] mb-4">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#1E3A5F] mb-4">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial on our Professional plan. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#1E3A5F] mb-4">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, bank transfers, and PayPal.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#1E3A5F] mb-4">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 