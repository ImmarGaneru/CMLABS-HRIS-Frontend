import { NextResponse } from 'next/server';
import { Xendit } from 'xendit-node';

const x = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY || '',
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const invoice = await x.Invoice.createInvoice({
            amount: body.amount,
            description: body.description,
            currency: 'IDR',
            reminder_time: 1,
            customer: body.customer,
            items: body.items,
        });

        return NextResponse.json({ invoiceUrl: invoice.invoiceUrl });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to create invoice' },
            { status: 500 }
        );
    }
} 