const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const parkingRouter = require('./routes/parking');
const personRouter = require('./routes/person');
const vipRouter = require('./routes/vip');
const reportRouter = require('./routes/report');
const vehicleRouter = require('./routes/vehicle');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/parking', parkingRouter);
app.use('/person', personRouter);
app.use('/vehicle', vehicleRouter);
app.use('/vip', vipRouter);
app.use('/report', reportRouter);

app.get('/', (req, res) => {
	res.send('Mall Parking Management System API');
});

module.exports = app;
