const Queue = require('bull');

const fileProcessorQueue = new Queue('file-processor', process.env.REDIS_URL);

module.exports = fileProcessorQueue;
