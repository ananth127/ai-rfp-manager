
import express from 'express';
import Proposal from '../models/Proposal';
import { fetchAndProcessEmails } from '../services/imapService';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rfpId } = req.query;
        let query = {};
        if (rfpId) query = { rfp: rfpId };

        const proposals = await Proposal.find(query).populate('vendor');
        res.json(proposals);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/refresh', async (req, res) => {
    try {
        const result = await fetchAndProcessEmails();
        // @ts-ignore
        if (result.error) {
            // @ts-ignore
            return res.status(500).json({ error: result.error });
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
