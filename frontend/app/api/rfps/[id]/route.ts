
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RFP from '@/models/RFP';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await connectDB();
    try {
        const rfp = await RFP.findById(params.id).populate('sentTo');
        if (!rfp) return NextResponse.json({ error: "RFP not found" }, { status: 404 });
        return NextResponse.json(rfp);
    } catch (error) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
}
