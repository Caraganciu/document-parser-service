const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs/promises');
const uploadController = require('../controllers/uploadController');

const uploadPath = process.env.FILE_UPLOAD_PATH;

// Async middleware to ensure upload directory exists before multer runs
async function ensureUploadDir(req, res, next) {
    try {
        await fs.mkdir(uploadPath, { recursive: true });
        // console.log(`Upload directory ensured at ${uploadPath}`);
        next();
    } catch (err) {
        console.error('Failed to create upload directory', err);
        res.status(500).json({ status: 'failed', message: 'Server error creating upload directory' });
    }
}

// Multer disk storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const dateHour = new Date().toISOString().replace(/[-:]/g, '').slice(0, 11);
        const randomToken = crypto.randomBytes(4).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${dateHour}-${randomToken}${ext}`);
    }
});

const upload = multer({ storage });

router.post('/upload', ensureUploadDir, upload.single('file'), uploadController.uploadFile);

module.exports = router;
