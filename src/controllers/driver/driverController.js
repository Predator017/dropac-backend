const express = require('express');
const Driver = require('../../models/driver/Driver');
const jwt = require('jsonwebtoken');
const otpService = require('../../services/otpService');
const moment = require('moment-timezone');
const driverLogger = require('../../utils/logger/driverLogger');

// Register Driver

const NodeCache = require("node-cache");

const app = express();
require("dotenv").config();
app.use(express.json());

let driverCache = new NodeCache({ stdTTL: 3600 });

// Register Driver
exports.register =  async (req, res) => {
  try {
    const { mobile, name, email } = req.body;
    await otpService.sendOTP(mobile);


    const driverData = {
      mobile: mobile,
      name: name,
      email: email,
    };
  
    // Store user data in cache
    driverCache.set(mobile, driverData);

    res.status(201).json({ message: `OTP sent to ${mobile} successfully` });


  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};


// Login Driver
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).send('Mobile number is required');
    }

    const driver = await Driver.findOne({ mobile });
    if (driver==null) {
      res.status(404).send('Driver not found');
        
    } else {
      await otpService.sendOTP(mobile);
      res.status(200).send({ message: 'OTP sent', userId: driver._id });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};


// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).send('Mobile number and OTP are required');
    }
  
    try {
      await otpService.verifyOTP(mobile, otp);
      const driver = await Driver.findOne({ mobile });
      if(driver==null){
        const DriverData = driverCache.get(mobile);
        const name = DriverData.name;
        const email = DriverData.email;
        const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        const newDriver = new Driver({ mobile, name, email, createdAt });
        await newDriver.save();
      }
      const driverr = await Driver.findOne({ mobile });


      const token = jwt.sign({ userId: driverr._id }, process.env.JWT_SECRET_CURRENT, { expiresIn: '2m' });
      const refreshToken = jwt.sign({ userId: driverr._id }, process.env.JWT_REFRESH_SECRET_CURRENT, { expiresIn: '3m' });
      const epochTime = Math.floor(Date.now() / 1000); // Get the current epoch time
      driverLogger.info(`Login successful driverid: ${driverr._id}`);
      res.status(200).json({ message: 'Login successful and token expire time is 1h', token, refreshToken, epochTime, userId: driverr._id  });
    } catch (error) {
      driverLogger.error(`Login failed error: ${error}`);
      res.status(400).send(error.message);
    }
  };


exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_CURRENT);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_CURRENT, { expiresIn: '2m' });
    const epochTime = Math.floor(Date.now() / 1000); // Get the current epoch time
    res.status(200).json({ accessToken, epochTime, message: 'expiry time is 1h' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token', error });
  }
};


// api to get driver profile
exports.getDriverProfile = async (req, res) => {
  try {
    const id = req.params.driverId;

    // Fetch the driver details
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const createdAt = moment(driver.createdAt);
    // Calculate the number of months from the createdAt date to now
    const months = moment().diff(createdAt, 'months');

    driver.months = months;
    driver.save();

    const driverObj = driver.toObject();
    if (
      driverObj.location &&
      driverObj.location.type === 'Point' &&
      Array.isArray(driverObj.location.coordinates) &&
      driverObj.location.coordinates.length === 2
    ) {
      driverObj.location.coordinates = [
        driverObj.location.coordinates[1], // lat
        driverObj.location.coordinates[0]  // lng
      ];
    }

    // Send response with driver and document statuses
    res.status(200).json({
      driver: driverObj
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve driver details',
      details: error.message
    });
  }
};


// update driver details with vehicle type and will drive
exports.updateDriver = async (req, res) => {
  try {
    const { 
      driverId, 
      willDrive, 
      vehicleNumber, 
      cityOfOperations, 
      vehicleType, 
      bodyDetails, 
      bodyType, 
      documentStatus, 
      vehicleStatus, 
      paymentdone, 
      rideInProgress, 
      location 
    } = req.body;

    // Find the driver by ID
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Update driver fields if provided
    if (willDrive !== undefined) driver.willDrive = willDrive;
    if (vehicleNumber !== undefined) driver.vehicleNumber = vehicleNumber;
    if (cityOfOperations !== undefined) driver.cityOfOperations = cityOfOperations;
    if (vehicleType !== undefined) driver.vehicleType = vehicleType;
    if (bodyDetails !== undefined) driver.bodyDetails = bodyDetails;
    if (bodyType !== undefined) driver.bodyType = bodyType;
    if (documentStatus !== undefined) driver.documentStatus = documentStatus;
    if (vehicleStatus !== undefined) driver.vehicleStatus = vehicleStatus;
    if (paymentdone !== undefined) driver.paymentdone = paymentdone;
    if (rideInProgress !== undefined) driver.rideInProgress = rideInProgress;

    // Update location if provided
    if (location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      const [lat, lng] = location.coordinates; // Extract lat, lng
      driver.location = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }

    // Save the updated driver
    await driver.save();
    if (!location){
        driverLogger.info(`Driver details updated driverid: ${driverId}`);
    }
    res.status(200).json({ message: 'Driver details updated', driver });
  } catch (error) {
    driverLogger.error(`Failed to updated driver details error: ${error}`);
    res.status(500).json({ error: 'Failed to update driver details', details: error.message });
  }
};


// api to cleaer a due amount from the driver wallet balance part 20 of the driver we will ccleardues feild in database from the body we will get fro cleardues feild only
exports.clearDues = async (req, res) => {
  const { paymentId, amount } = req.body;

  if (!paymentId || !amount) {
    return res.status(400).json({ message: 'Payment ID and amount are required' });
  }

  try {
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Clear or make the part 20 of the driver wallet balance to 0
    driver.walletBalance.part20 = 0;

    const time = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    // Add the new transaction to the cleardues array
    driver.cleardues.push({
      paymentId,
      amount,
      time
    });

    await driver.save();
    driverLogger.info(`Dues cleared succesfullly driverid: ${req.params.driverId}`);
    res.status(200).json({ message: 'Dues cleared successfully', driver });
  } catch (error) {
    driverLogger.error(`Failed to clear dues driverid: ${req.params.driverId}, error: ${error}`);
    res.status(500).json({ error: 'Failed to clear dues', details: error.message });
  }
};

// api to get cleaedues object from the driver model
exports.clearedDues = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver.cleardues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cleared dues', details: error.message });
  }
};


