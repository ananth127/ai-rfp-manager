const Proposal = require('../models/Proposal');
const imapService = require('../services/imapService');

exports.getProposalsByRFP = async (req, res) => {
    try {
        const proposals = await Proposal.find({ rfp: req.params.rfpId })
            .populate('vendor')
            .sort({ 'parsedData.score': -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.triggerRefresh = async (req, res) => {
    try {
        const result = await imapService.fetchAndProcessEmails();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
