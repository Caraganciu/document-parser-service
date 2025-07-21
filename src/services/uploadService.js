const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const fileProcessorQueue = require('../queues/fileProcessorQueue');
const redisClient = require('./redisClient');

const uploadDir = process.env.FILE_UPLOAD_PATH || path.join(__dirname, '..', 'uploads');

exports.processFile = async (file) => {
    const allowedTypes = ['application/pdf'];

    if (!allowedTypes.includes(file.mimetype)) {
        return { success: false, message: 'Only PDF files are allowed' };
    }

    try {
        // Ensure upload directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        // Generate random filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const random = crypto.randomBytes(6).toString('hex');
        const filename = `doc-${timestamp}-${random}.pdf`;
        const fullPath = path.join(uploadDir, filename);

        // READ file from disk (file.path) and write to your uploadDir
        const fileBuffer = await fs.readFile(file.path);
        await fs.writeFile(fullPath, fileBuffer);

        // Update status in Redis
        const statusKey = `upload:${filename}`;
        const statusValue = JSON.stringify({
            status: 'uploaded',
            timestamp: new Date().toISOString(),
        });
        await redisClient.set(statusKey, statusValue);

        // Add job to processing queue
        await fileProcessorQueue.add({
            filename,
            path: fullPath
        });

        return { success: true, message: 'File was saved and queued for processing', filename };
    } catch (err) {
        console.error('Upload service error:', err);
        return { success: false, message: 'Internal error while saving file' };
    }
};