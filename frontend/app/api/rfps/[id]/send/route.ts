
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RFP from '@/models/RFP';
import Vendor from '@/models/Vendor';
import { sendRFPEmail } from '@/lib/email';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { vendorIds } = await request.json();

    const rfp = await RFP.findById(params.id);
    if (!rfp) return NextResponse.json({ error: "RFP not found" }, { status: 404 });

    const vendors = await Vendor.find({ '_id': { $in: vendorIds } });

    // Send emails in parallel
    await Promise.all(vendors.map(v => sendRFPEmail(v, rfp)));

    rfp.sentTo = vendorIds;
    rfp.status = 'sent';
    await rfp.save();

    return NextResponse.json({ message: "Sent", rfp });
}
