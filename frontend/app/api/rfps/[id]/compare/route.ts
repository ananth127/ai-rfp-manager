
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RFP from '@/models/RFP';
import Proposal from '@/models/Proposal';
import { compareProposals } from '@/lib/ai';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const rfp = await RFP.findById(id);
        if (!rfp) {
            return NextResponse.json({ error: "RFP not found" }, { status: 404 });
        }

        const proposals = await Proposal.find({ rfp: id }).populate('vendor');
        if (!proposals || proposals.length === 0) {
            return NextResponse.json({ error: "No proposals found to compare" }, { status: 400 });
        }

        const comparison = await compareProposals(rfp.originalRequest, proposals);

        return NextResponse.json(comparison);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
