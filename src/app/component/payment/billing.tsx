'use client';
import { GoHistory } from "react-icons/go";
import { MdTune } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function BillList(){
    return(
        <div className="flex flex-col px-6 py-6 gap-4 w-full h-fit bg-[#F8F8F8] rounded-2xl">
            {/* Bill header */}
            <div className="flex flex-row w-full items-center justify-between">
                <h3 className="text-2xl font-bold text-blue-950">App Billing</h3>
                {/* button container */}
                <div className="flex flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-lg border border-[#141414]/30 transition-colors">
                        <MdTune size={20}/>
                        <span className="font-medium">Filter</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-lg border border-[#141414]/30 transition-colors">
                        <GoHistory size={20}/>
                        <span className="font-medium">History</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-[#2D8EFF] hover:bg-[#2D8EFF]/90 text-white px-4 py-2.5 rounded-lg border-[#141414]/30 transition-colors">
                        <IoArrowBackOutline size={20}/>
                        <span className="font-medium">Kembali</span>
                    </button>
                </div>
            </div>
            {/* Table Bill field data */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-[#141414] text-[16px] font-bold min-w-[360px]">Tagihan Maret 2025</td>
                            <td className="px-4 py-3 text-[#141414] text-[16px]">Premium/280 Seat</td>
                            <td className="px-4 py-3 text-[#141414] text-[16px]">Due: 03/04/2025</td>
                            <td className="px-4 py-3 text-center">
                                <span className="px-2 py-2 bg-[#FFAB00] text-white rounded-lg text-sm inline-block">Unpaid</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button className="px-2 py-2 bg-[#2D8EFF]/90 hover:bg-[#2D8EFF] text-white rounded-lg text-sm border border-[#141414]/30">
                                    Detail
                                </button>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-[#141414] text-[16px] font-bold min-w-[360px]">Tagihan Maret 2025</td>
                            <td className="px-4 py-3 text-[#141414] text-[16px]">Premium/280 Seat</td>
                            <td className="px-4 py-3 text-[#141414] text-[16px]">Due: 03/04/2025</td>
                            <td className="px-4 py-3 text-center">
                                <span className="px-2 py-2 bg-[#C11106] text-white rounded-lg text-sm inline-block">Overdue</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button className="px-2 py-2 bg-[#2D8EFF]/90 hover:bg-[#2D8EFF] text-white rounded-lg text-sm border border-[#141414]/30">
                                    Detail
                                </button>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-[#141414] text-[16px] font-bold min-w-[360px]">Tagihan Maret 2025</td>
                            <td className="px-4 py-3 text-[#141414] text-[16px]">Premium/280 Seat</td>
                            <td className="px-4 py-3 text-[#141414] text-[16px]">Due: 03/04/2025</td>
                            <td className="px-4 py-3 text-center">
                                <span className="px-2 py-2 bg-[#257047] text-white rounded-lg text-sm inline-block">Paid</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button className="px-2 py-2 bg-[#2D8EFF]/90 hover:bg-[#2D8EFF] text-white rounded-lg text-sm border border-[#141414]/30">
                                    Detail
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">20</span> records
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        <IoIosArrowBack size={20}/>
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        1
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        2
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        3
                    </button>
                    <button className="flex items-center justify-center w-8 h-8 border border-[#7CA5BF] rounded-lg text-[#7CA5BF] hover:bg-[#7CA5BF] hover:text-white transition-colors">
                        <IoIosArrowForward size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
}