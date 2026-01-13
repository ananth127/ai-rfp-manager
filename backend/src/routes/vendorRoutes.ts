
import express from 'express';
import Vendor from '../models/Vendor';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const vendor = new Vendor(req.body);
        await vendor.save();
        res.status(201).json(vendor);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
