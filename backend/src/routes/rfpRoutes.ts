
import express from 'express';
import RFP from '../models/RFP';
import Vendor from '../models/Vendor';
import { parseRFPRequest, compareProposals } from '../services/aiService';
import { sendRFPEmail } from '../services/emailService';
import Proposal from '../models/Proposal';

const router = express.Router();

// GET all RFPs
router.get('/', async (req, res) => {
    try {
        const rfps = await RFP.find().sort({ createdAt: -1 });
        res.json(rfps);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST create RFP
router.post('/', async (req, res) => {
    try {
        const rfp = new RFP({ ...req.body, status: 'draft' });
        await rfp.save();
        res.status(201).json(rfp);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST parse RFP
router.post('/parse', async (req, res) => {
    try {
        const { originalRequest } = req.body;
        if (!originalRequest) return res.status(400).json({ error: "No request text provided" });

        const structuredData = await parseRFPRequest(originalRequest);
        res.json(structuredData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET By ID
router.get('/:id', async (req, res) => {
    try {
        const rfp = await RFP.findById(req.params.id);
        if (!rfp) return res.status(404).json({ error: "RFP not found" });
        res.json(rfp);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST Send RFP to Vendors
router.post('/:id/send', async (req, res) => {
    try {
        const { vendorIds } = req.body;
        const rfp = await RFP.findById(req.params.id);
        if (!rfp) return res.status(404).json({ error: "RFP not found" });

        const vendors = await Vendor.find({ '_id': { $in: vendorIds } });

        await Promise.all(vendors.map(v => sendRFPEmail(v, rfp)));

        rfp.sentTo = vendorIds;
        rfp.status = 'sent';
        await rfp.save();

        res.json({ message: "Sent", rfp });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET Compare Proposals
router.get('/:id/compare', async (req, res) => {
    try {
        const { id } = req.params;
        const rfp = await RFP.findById(id);
        if (!rfp) {
            return res.status(404).json({ error: "RFP not found" });
        }

        const proposals = await Proposal.find({ rfp: id }).populate('vendor');
        if (!proposals || proposals.length === 0) {
            return res.status(400).json({ error: "No proposals found to compare" });
        }

        const comparison = await compareProposals(rfp.originalRequest, proposals);
        res.json(comparison);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
