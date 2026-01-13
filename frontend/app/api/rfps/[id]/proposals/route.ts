
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Proposal from '@/models/Proposal';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await connectDB();
    try {
        const proposals = await Proposal.find({ rfp: params.id })
            .populate('vendor')
            .sort({ 'parsedData.score': -1 });
        return NextResponse.json(proposals);
    } catch (e) {
        return NextResponse.json([]);
    }
}
