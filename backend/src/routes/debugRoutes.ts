
import express from 'express';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import RFP from '../models/RFP';
import Vendor from '../models/Vendor';
import Proposal from '../models/Proposal';
import { parseVendorResponse } from '../services/aiService';
import { logger } from '../utils/logger';

const router = express.Router();

// Health Check
router.get('/health', async (req, res) => {
    logger.info("Starting System Health Check...");

    const status: any = {
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
    res.json(status);
});

// Simulate Response
router.post('/simulate-response', async (req, res) => {
    try {
        const { rfpId, vendorId, emailBody } = req.body;

        const rfp = await RFP.findById(rfpId);
        const vendor = await Vendor.findById(vendorId);

        if (!rfp || !vendor) {
            return res.status(404).json({ error: "RFP or Vendor not found" });
        }

        const parsedData = await parseVendorResponse(emailBody);

        if (!parsedData) {
            return res.status(500).json({ error: "AI failed to parse response" });
        }

        const proposal = new Proposal({
            rfp: rfp._id,
            vendor: vendor._id,
            emailContent: emailBody,
            parsedData,
            receivedAt: new Date()
        });

        await proposal.save();

        res.json({ message: "Simulated proposal added", proposal });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
