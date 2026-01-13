
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { logger } from '@/lib/logger';

export async function GET() {
    logger.info("Starting System Health Check...");

    const status = {
        database: 'UNKNOWN',
        openai: 'UNKNOWN',
        serverTime: new Date().toISOString(),
        env: {
            mongoUriConfigured: !!process.env.MONGO_URI,
            openaiKeyConfigured: !!process.env.OPENAI_API_KEY,
            loggingEnabled: process.env.ENABLE_LOGGING === 'true'
        }
    };

    // 1. Check MongoDB
    try {
        await connectDB();
        const dbState = mongoose.connection.readyState;
        status.database = dbState === 1 ? 'CONNECTED' : `DISCONNECTED (State: ${dbState})`;
        logger.info("Database check passed");
    } catch (error: any) {
        status.database = `ERROR: ${error.message}`;
        logger.error("Database check failed", error);
    }

    // 2. Check OpenAI
    try {
        if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            // Simple model list to verify key validity
            await openai.models.list();
            status.openai = 'CONNECTED';
            logger.info("OpenAI check passed");
        } else {
            status.openai = 'MISSING_KEY';
            logger.error("OpenAI key missing");
        }
    } catch (error: any) {
        status.openai = `ERROR: ${error.message}`;
        logger.error("OpenAI check failed", error);
    }

    logger.info("Health check complete", status);

    return NextResponse.json(status);
}
