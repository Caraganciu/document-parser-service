/**
 * @typedef {Object} OCRResult
 * @property {string} text
 * @property {number} confidence
 * @property {string} language
 */

/**
 * Simulate OCR processing on an image buffer.
 * @param {Buffer} imageBuffer
 * @returns {Promise<OCRResult>}
 */
function simulateOCR(imageBuffer) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                text: "This is a simulated OCR result.",
                confidence: 0.98,
                language: "en",
            });
        }, 5500);
    });
}

module.exports = { simulateOCR };
