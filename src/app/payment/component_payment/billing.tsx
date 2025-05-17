'use client';
import { GoHistory } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Bill {
    id: string;
    title: string;
    plan: string;
    seat: number;
    price: number;
    dueDate: string;
    status: 'unpaid' | 'paid' | 'overdue';
}

export default function BillList(){
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);

    const bills: Bill[] = [
        {
            id: 'INV-001',
            title: 'Tagihan Maret 2025',
            plan: 'Premium',
            seat: 280,
            price: 18000,
            dueDate: '03/04/2025',
            status: 'unpaid'
        },
        {
            id: 'INV-002',
            title: 'Tagihan Februari 2025',
            plan: 'Premium',
            seat: 256,
            price: 18000,
            dueDate: '03/03/2025',
            status: 'overdue'
        },
        {
            id: 'INV-003',
            title: 'Tagihan Januari 2025',
            plan: 'Premium',
            seat: 200,
            price: 18000,
            dueDate: '03/02/2025',
            status: 'paid'
        }
    ];

    const handleViewInvoice = (invoiceId: string, title: string, plan: string, seat: number, price: number, dueDate: string, status: string) => {
        const data = {
            id: invoiceId,
            title,
            plan,
            seat,
            price,
            dueDate,
            status,
            amount: seat * price
        };
        router.push(`/payment/invoice?data=${encodeURIComponent(JSON.stringify(data))}`);
    };

    const filteredBills = bills.filter(bill => 
        showHistory ? bill.status === 'paid' : bill.status !== 'paid'
    );

    return(
        <div className="flex flex-col px-6 py-6 gap-4 w-full h-fit bg-[#F8F8F8] rounded-2xl">
            {/* Bill header */}
            <div className="flex flex-row w-full items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-950">
                    {showHistory ? 'Payment History' : 'App Billing'}
                </h3>
                {/* button container */}
                <div className="flex flex-row gap-3">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`flex items-center justify-center gap-2 ${
                            showHistory 
                                ? 'bg-[#2D8EFF] hover:bg-[#2D8EFF]/90 text-white' 
                                : 'hover:bg-gray-200 text-gray-900'
                        } px-4 py-2.5 rounded-lg border border-[#141414]/30 transition-colors`}
                    >
                        <GoHistory size={20}/>
                        <span className="font-medium">{showHistory ? 'History' : 'History'}</span>
                    </button>
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center gap-2 bg-[#2D8EFF] hover:bg-[#2D8EFF]/90 text-white px-4 py-2.5 rounded-lg border-[#141414]/30 transition-colors"
                    >
                        <IoArrowBackOutline size={20}/>
                        <span className="font-medium">Kembali</span>
                    </button>
                </div>
            </div>
            {/* Table Bill field data */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {filteredBills.map((bill) => (
                            <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-[#141414] text-[16px] font-bold min-w-[360px]">{bill.title}</td>
                                <td className="px-4 py-3 text-[#141414] text-[16px]">{bill.plan}</td>
                                <td className="px-4 py-3 text-[#141414] text-[16px]">{bill.seat} Seat</td>
                                <td className="px-4 py-3 text-[#141414] text-[16px]">Rp {bill.price.toLocaleString()}/seat</td>
                                <td className="px-4 py-3 text-[#141414] text-[16px]">Due: {bill.dueDate}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-2 text-white rounded-lg text-sm inline-block ${
                                        bill.status === 'paid' ? 'bg-[#257047]' :
                                        bill.status === 'overdue' ? 'bg-[#C11106]' :
                                        'bg-[#FFAB00]'
                                    }`}>
                                        {bill.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        onClick={() => handleViewInvoice(
                                            bill.id,
                                            bill.title,
                                            bill.plan,
                                            bill.seat,
                                            bill.price,
                                            bill.dueDate,
                                            bill.status
                                        )}
                                        className={`px-2 py-2 ${
                                            bill.status === 'paid'
                                                ? 'bg-gray-400'
                                                : 'bg-[#2D8EFF]/90 hover:bg-[#2D8EFF]'
                                        } text-white rounded-lg text-sm border border-[#141414]/30`}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBills.length}</span> of <span className="font-medium">{filteredBills.length}</span> records
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        <IoIosArrowBack size={20}/>
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        1
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        <IoIosArrowForward size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
}