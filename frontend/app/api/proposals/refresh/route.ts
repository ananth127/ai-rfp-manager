
import { NextResponse } from 'next/server';
import { fetchAndProcessEmails } from '@/lib/imap';

export async function POST() {
    // Trigger long running process
    // In Vercel, this might timeout if > 10s (Free) or 60s (Pro).
    // For demo, it's fine.
    const result = await fetchAndProcessEmails();
    return NextResponse.json(result);
}
