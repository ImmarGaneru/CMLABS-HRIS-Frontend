'use client';
import { useState, useEffect } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';

interface InvoiceData {
    id: string;
    title: string;
    plan: string;
    seat: number;
    price: number;
    dueDate: string;
    amount: number;
    status: 'unpaid' | 'paid' | 'overdue';
}

export default function Invoice() {
    const searchParams = useSearchParams();
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(data));
                setInvoiceData(parsedData);
            } catch (error) {
                console.error('Error parsing invoice data:', error);
            }
        }
    }, [searchParams]);

    const handlePayment = async () => {
        if (!invoiceData) return;
        
        try {
            setIsProcessing(true);
            
            const response = await fetch('/api/create-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: invoiceData.amount,
                    description: `${invoiceData.title} - ${invoiceData.plan}`,
                    customer: {
                        given_names: "Customer Name", // Replace with actual customer data
                        email: "customer@example.com", // Replace with actual customer data
                    },
                    items: [
                        {
                            name: invoiceData.plan,
                            quantity: 1,
                            price: invoiceData.amount,
                            category: "Subscription",
                        },
                    ],
                }),
            });

            const data = await response.json();
            
            if (data.invoiceUrl) {
                window.location.href = data.invoiceUrl;
            } else {
                throw new Error('No invoice URL received');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to process payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!invoiceData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col px-6 py-6 gap-4 w-full h-fit bg-[#F8F8F8] rounded-2xl">
            {/* Header */}
            <div className="flex flex-row w-full items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-950">Invoice Details</h3>
                <Button onClick={() => window.history.back()} variant='redirectButton'>
                    <IoArrowBackOutline size={20}/>
                    <span className="font-medium">Kembali</span>
                </Button>
            </div>

            {/* Invoice Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-[#141414]">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Invoice Information</h4>
                        <div className="space-y-2">
                            <p><span className="font-medium">Invoice ID:</span> {invoiceData.id}</p>
                            <p><span className="font-medium">Title:</span> {invoiceData.title}</p>
                            <p><span className="font-medium">Due Date:</span> {invoiceData.dueDate}</p>
                            <p><span className="font-bold">Plan:</span></p>
                            <p className='text-[#141414]/60 ml-4'>{invoiceData.plan}</p>
                            <p className='text-[#141414]/60 ml-4'>{invoiceData.seat} seat</p>
                            <p className='text-[#141414]/60 ml-4'>Rp {invoiceData.price.toLocaleString()}/seat</p>
                            <p className='text-[#141414]/60 ml-4'>Rp {invoiceData.price.toLocaleString()} x {invoiceData.seat} seat</p>
                            <p className='text-[#141414] ml-4 font-bold'><span className="font-bold">Total Amount:</span> Rp {invoiceData.amount.toLocaleString()}</p>
                            <p>
                                <span className="font-medium">Status:</span>{' '}
                                <span className={`px-2 py-1 rounded-lg text-sm ${
                                    invoiceData.status === 'paid' ? 'bg-[#257047] text-white' :
                                    invoiceData.status === 'overdue' ? 'bg-[#C11106] text-white' :
                                    'bg-[#FFAB00] text-white'
                                }`}>
                                    {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="border-l pl-6">
                        <h4 className="text-lg font-semibold mb-4">Payment Information</h4>
                        {invoiceData.status === 'paid' ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-[#257047] font-medium">Payment Completed</p>
                                    <p className="text-[#257047]/80 text-sm mt-1">This invoice has been successfully paid</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-600">Payment Details:</p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Payment Date: {invoiceData.dueDate}</p>
                                        <p className="text-sm text-gray-600">Payment Method: Bank Transfer</p>
                                        <p className="text-sm text-gray-600">Transaction ID: TRX-{invoiceData.id}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="credit_card"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio"
                                        />
                                        <span>Credit Card</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank_transfer"
                                            checked={paymentMethod === 'bank_transfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio"
                                        />
                                        <span>Bank Transfer</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="e_wallet"
                                            checked={paymentMethod === 'e_wallet'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-radio"
                                        />
                                        <span>E-Wallet</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={!paymentMethod || isProcessing}
                                    className={`w-full py-3 rounded-lg text-white font-medium ${
                                        !paymentMethod || isProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-[#2D8EFF] hover:bg-[#2D8EFF]/90'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 