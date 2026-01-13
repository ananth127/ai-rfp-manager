
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/models/Vendor';

export async function GET() {
    await connectDB();
    const vendors = await Vendor.find();
    return NextResponse.json(vendors);
}

export async function POST(request: Request) {
    await connectDB();
    const body = await request.json();
    const vendor = new Vendor(body);
    await vendor.save();
    return NextResponse.json(vendor, { status: 201 });
}
