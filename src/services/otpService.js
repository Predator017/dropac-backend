const axios = require("axios");
const express = require("express");
const NodeCache = require("node-cache");
const app = express();
const otpserviceLogger = require('../../src/utils/logger/otpserviceLogger');

require("dotenv").config();

app.use(express.json());

let otpCache = new NodeCache({ stdTTL: 600 });

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(mobile) {
    try {
        const otp = generateOTP();

        otpCache.set(mobile, otp);

        const response = await axios.post('https://api.msg91.com/api/v5/otp', {
            mobile: mobile,
            otp: otp,
            authkey: process.env.MSG91_AUTH_KEY,
            template_id: process.env.MSG91_TEMPLATE_ID
        });


        if (response.data.type !== 'success') {
            otpserviceLogger.error(`Failed to send OTP`);
            throw new Error('Failed to send OTP');
        }

        return otp;
    } catch (error) {
        otpserviceLogger.error(`Failed to send OTP error: ${error}`);
        throw new Error('Failed to send OTP');
    }
}

async function verifyOTP(mobile, otp) {
    const storedOtp = otpCache.get(mobile);

    if (!storedOtp) {
    throw new Error("OTP data not found or expired for this mobile number");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  // Remove OTP after successful verification
 otpCache.del(mobile);

  return true;

}

module.exports = { sendOTP, verifyOTP, generateOTP };