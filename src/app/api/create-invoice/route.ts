import { NextResponse } from 'next/server';
import { Xendit } from 'xendit-node';

const x = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY || '',
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // NOTE: This block of code yielded this error: 
        //      Type error: Object literal may only specify known properties, and 'amount' does not exist in type 'CreateInvoiceOperationRequest'.
        // For the sake of the dev ops operation, had to comment it for now.
        // const invoice = await x.Invoice.createInvoice({
        //     amount: body.amount,
        //     description: body.description,
        //     currency: 'IDR',
        //     reminder_time: 1,
        //     customer: body.customer,
        //     items: body.items,
        // });

        // return NextResponse.json({ invoiceUrl: invoice.invoiceUrl });

        return NextResponse.json({msg: "Change me later"})
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to create invoice' },
            { status: 500 }
        );
    }
} 