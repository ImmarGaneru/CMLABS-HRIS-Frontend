'use client';

import BillList from "../component/payment/billing";

export default function PaymentPage(){
    return(
        <section className="bg-gray-300 flex flex-col px-4 py-2 gap-6 w-full h-fit">
            {/* Halaman Billing*/}
            <BillList/>
        </section>
    );
}