
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RFP from '@/models/RFP';

export async function GET() {
    await connectDB();
    const rfps = await RFP.find().sort({ createdAt: -1 });
    return NextResponse.json(rfps);
}

export async function POST(request: Request) {
    await connectDB();
    const body = await request.json();
    const rfp = new RFP({ ...body, status: 'draft' });
    await rfp.save();
    return NextResponse.json(rfp, { status: 201 });
}
