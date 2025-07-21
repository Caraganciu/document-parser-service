const path = require('path');
const fs = require('fs/promises');
const { fromPath } = require('pdf2pic');
const redisClient = require('../services/redisClient');
const { simulateOCR } = require('../services/ocrService');
const { validateInvoiceText } = require('../validation/invoiceValidator');

async function processFile(filePath, filename) {
    const ext = path.extname(filename).toLowerCase();

    try {
        await redisClient.set(filename, JSON.stringify({
            status: 'processing',
            startedAt: new Date().toISOString(),
        }));

        let ocrResults = [];

        if (ext === '.pdf') {
            const options = {
                density: 100,
                saveFilename: 'page',
                savePath: './temp',
                format: 'png',
                width: 800,
                height: 1100,
            };

            try {
                await fs.mkdir(options.savePath);
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }

            const pdfConverter = fromPath(filePath, options);
            const maxPages = 10;

            for (let i = 1; i <= maxPages; i++) {
                try {
                    const output = await pdfConverter(i, true);
                    const buffer = output.base64 ? Buffer.from(output.base64, 'base64') : null;
                    if (!buffer) break;

                    const ocrResult = await simulateOCR(buffer);
                    ocrResults.push({ page: i, ...ocrResult });
                } catch {
                    break;
                }
            }

        } else {
            const fileBuffer = await fs.readFile(filePath);
            const ocrResult = await simulateOCR(fileBuffer);
            ocrResults.push({ page: 1, ...ocrResult });
        }

        // Combine all OCR text and validate before saving
        const combinedText = ocrResults.map(p => p.text).join('\n');
        const validation = validateInvoiceText(combinedText);

        if (!validation.isValid) {
            // Save failure status only
            await redisClient.set(`${filename}:validation`, JSON.stringify(validation));
            await redisClient.set(filename, JSON.stringify({
                status: 'failedValidation',
                processedAt: new Date().toISOString(),
                pagesProcessed: ocrResults.length,
                missingFields: validation.missingFields,
            }));

            console.log(`Validation failed for ${filename}, missing fields:`, validation.missingFields);
            return {
                success: false,
                message: 'Validation failed',
                missingFields: validation.missingFields
            };
        }

        // Save OCR data and validation only if valid
        await redisClient.set(`${filename}:ocrData`, JSON.stringify(ocrResults));
        await redisClient.set(`${filename}:validation`, JSON.stringify(validation));
        await redisClient.set(filename, JSON.stringify({
            status: 'processed',
            processedAt: new Date().toISOString(),
            pagesProcessed: ocrResults.length,
        }));

        console.log(`Processed ${ext} file ${filename}, pages OCRed: ${ocrResults.length}`);
        return { success: true, message: `Processed ${ocrResults.length} page(s).` };

    } catch (error) {
        console.error('Error in processFile:', error);
        await redisClient.set(filename, JSON.stringify({
            status: 'error',
            error: error.message,
            processedAt: new Date().toISOString(),
        }));
        return { success: false, message: 'Failed to process file' };
    }
}

module.exports = {
    processFile,
};
