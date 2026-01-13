
import { NextResponse } from 'next/server';
import { parseRFPRequest } from '@/lib/ai';

export async function POST(request: Request) {
    const { originalRequest } = await request.json();

    if (!originalRequest) {
        return NextResponse.json({ error: "No request text provided" }, { status: 400 });
    }

    const structuredData = await parseRFPRequest(originalRequest);
    return NextResponse.json(structuredData);
}
