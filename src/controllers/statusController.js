const express = require('express');
const router = express.Router();
const redisClient = require('../services/redisClient');

router.post('/status', async (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'Filename is required' });
    }

    try {
        // Get status info
        const statusDataRaw = await redisClient.get(filename);
        if (!statusDataRaw) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Get OCR data
        const ocrDataRaw = await redisClient.get(`${filename}:ocrData`);

        const statusData = JSON.parse(statusDataRaw);
        const ocrData = ocrDataRaw ? JSON.parse(ocrDataRaw) : null;

        return res.json({
            success: true,
            status: statusData,
            ocrData: ocrData,
        });
    } catch (error) {
        console.error('Error fetching file status:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
