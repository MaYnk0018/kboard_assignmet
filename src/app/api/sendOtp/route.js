
import {Otp} from '../../../models/dbconfig';
import axios from 'axios';
import dotenv from 'dotenv';
import { connectDB } from "../../../lib/mongo";

import { createHash, hashCompare } from "../../../helper/hash"; // Corrected import
import auth from "../../../../helper/auth";
import { NextResponse } from "next/server";

dotenv.config();

const fast2smsAPIKey = process.env.FAST2SMS_APIKEY;
const fast2smsURL = process.env.FAST2SMS_URL;

export default async function handler(req, res) {
  await connectDB();  // Connect to MongoDB

  if (req.method === 'POST') {
    try {
      const { mobile } = req.body;
      const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
      const otp = generateOtp();
      const otpHash = await createHash(otp.toString());
      const message = `Your login OTP for TaskManager Web App is ${otp}. Please do not share it with anyone.`;

      const existingOtp = await Otp.findOne({ mobile });

      if (existingOtp) {
        // Update OTP
        existingOtp.hashedOtp = otpHash;
        existingOtp.createdAt = new Date();
        await existingOtp.save();
      } else {
        // Insert OTP
        const newOtp = new Otp({ mobile, hashedOtp: otpHash, createdAt: new Date() });
        await newOtp.save();
      }

      // Send OTP via Fast2SMS
      const fast2smsData = {
        route: 'p',
        sender_id: 'TXTIND',
        message: message,
        language: 'english',
        numbers: mobile
      };

      await axios.post(fast2smsURL, fast2smsData, {
        headers: {
          Authorization: fast2smsAPIKey
        }
      });

      res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
      res.status(500).json({ message: 'Error in generating OTP', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
