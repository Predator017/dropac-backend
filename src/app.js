const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./services/rabbitmqService'); // optional to rename
require('dotenv').config();

//customer routes
const userRoutes = require('./routes/customer/userRoutes');
const addressRoutes = require('./routes/customer/addressRoutes');
const rideRoutes = require('./routes/customer/rideRoutes');

//driver routes
const documentRoutes = require('./routes/driver/documentRoutes');
const driverRoutes = require('./routes/driver/driverRoutes');
const geolocationRoutes = require('./routes/driver/geoRoutes');
const driverrideRoutes = require('./routes/driver/rideRoutes');

//payment routes
const paymentRoutes = require('./routes/payment/paymentRoutes');


const app = express();

// Database
connectDB();

// Connect RabbitMQ
connectRabbitMQ();

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});
  

// Middleware
app.use(express.json()); // replaces body-parser
app.use(express.urlencoded({ extended: true }));

// User service routes
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/user-rides', rideRoutes);

// Driver service routes
app.use('/api/documents', documentRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/geolocation', geolocationRoutes);
app.use('/api/driver-rides', driverrideRoutes);

// Payment service routes
app.use('/api/payments', paymentRoutes);


module.exports = app;
