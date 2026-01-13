
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RFP from '@/models/RFP';
import Vendor from '@/models/Vendor';
import Proposal from '@/models/Proposal';
import { parseVendorResponse } from '@/lib/ai';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { rfpId, vendorId, emailBody } = await request.json();

        const rfp = await RFP.findById(rfpId);
        const vendor = await Vendor.findById(vendorId);

        if (!rfp || !vendor) {
            return NextResponse.json({ error: "RFP or Vendor not found" }, { status: 404 });
        }

        // Use AI to parse the simulated body
        const parsedData = await parseVendorResponse(emailBody);

        if (!parsedData) {
            return NextResponse.json({ error: "AI failed to parse response" }, { status: 500 });
        }

        const proposal = new Proposal({
            rfp: rfp._id,
            vendor: vendor._id,
            emailContent: emailBody,
            parsedData,
            receivedAt: new Date()
        });

        await proposal.save();

        return NextResponse.json({ message: "Simulated proposal added", proposal });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
