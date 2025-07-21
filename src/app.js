const express = require('express');
const logger = require('morgan');

const healthRouter = require('./routes/health');
const uploadRouter = require('./routes/upload');
const statusRouter = require('./controllers/statusController');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', healthRouter);
app.use('/api', uploadRouter);
app.use('/file', statusRouter);

module.exports = app;
