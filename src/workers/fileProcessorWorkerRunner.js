const fileProcessorQueue = require('../queues/fileProcessorQueue');
const { processFile } = require('./fileProcessorWorker');

fileProcessorQueue.process(async (job) => {
    const { filename, path } = job.data;

    console.log(`Worker received job for: ${filename}`);

    try {
        const result = await processFile(path, filename);
        console.log(`Job completed for: ${filename}`);
        return result;
    } catch (err) {
        console.error(`Job failed for: ${filename}`, err);
        throw err;
    }
});

console.log('Worker is listening for jobs...');
