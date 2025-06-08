'use client';

import BillList from "./component_payment/billing";

export default function PaymentPage(){
    return(
        <section className="flex flex-col px-2 py-4 gap-6 w-full h-fit">
            {/* Halaman Billing*/}
            <BillList/>
        </section>
    );
}