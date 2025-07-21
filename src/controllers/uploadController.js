const path = require('path');
const uploadService = require('../services/uploadService'); // assuming you have it
const redisClient = require('../services/redisClient'); // import existing redis client

exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'failed', message: 'No file uploaded' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype !== 'application/pdf' || ext !== '.pdf') {
        return res.status(400).json({ status: 'failed', message: 'Only PDF files are allowed' });
    }

    try {
        // Assuming uploadService.processFile saves the file on disk and returns filename
        const result = await uploadService.processFile(file);

        if (!result.success) {
            return res.status(400).json({ status: 'failed', message: result.message });
        }

        // Save file status in Redis (filename is unique token generated in processFile)
        await redisClient.set(result.filename, JSON.stringify({
            status: 'uploaded',
            path: result.path // you can save the real saved path here
        }));

        res.json({
            status: 'success',
            message: 'File was saved',
            filename: result.filename
        });
    } catch (error) {
        console.error('Error saving file status to Redis:', error);
        res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
};
