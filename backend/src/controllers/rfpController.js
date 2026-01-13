const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

exports.createRFP = async (req, res) => {
    try {
        const { title, originalRequest, structuredData } = req.body;
        const rfp = new RFP({
            title,
            originalRequest,
            structuredData,
            status: 'draft'
        });
        await rfp.save();
        res.status(201).json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.parseRFP = async (req, res) => {
    try {
        const { originalRequest } = req.body;
        if (!originalRequest) return res.status(400).json({ error: "Request text is required" });

        const structuredData = await aiService.parseRFPRequest(originalRequest);
        res.json(structuredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRFPs = async (req, res) => {
    try {
        const rfps = await RFP.find().sort({ createdAt: -1 });
        res.json(rfps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRFPById = async (req, res) => {
    try {
        const rfp = await RFP.findById(req.params.id).populate('sentTo');
        if (!rfp) return res.status(404).json({ error: "RFP not found" });
        res.json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendRFP = async (req, res) => {
    try {
        const { vendorIds } = req.body;
        const rfp = await RFP.findById(req.params.id);

        if (!rfp) return res.status(404).json({ error: "RFP not found" });

        // Find vendors
        const vendors = await Vendor.find({ '_id': { $in: vendorIds } });

        const emailPromises = vendors.map(vendor => emailService.sendRFPEmail(vendor, rfp));
        await Promise.all(emailPromises);

        rfp.sentTo = vendorIds;
        rfp.status = 'sent';
        await rfp.save();

        res.json({ message: `RFP sent to ${vendors.length} vendors`, rfp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
