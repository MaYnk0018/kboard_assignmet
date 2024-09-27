

import {UserAuth} from '../../../models/dbconfig';
import auth from '../../../helper/auth';


import { connectDB } from "../../../lib/mongo";
import { Otp } from "../../../models/dbconfig";
import { createHash, hashCompare } from "../../../helper/hash"; // Corrected import




export default async function handler(req, res) {
  await connectDB();  // Connect to MongoDB

  if (req.method === 'POST') {
    try {
      const { mobile, otp } = req.body;

      const existingOtp = await Otp.findOne({ mobile });
      if (!existingOtp) {
        return res.status(400).json({ message: 'Invalid mobile number or OTP' });
      }

      const isOtpValid = await hashCompare(otp, existingOtp.hashedOtp);
      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      const user = await UserAuth.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const loginToken = await auth.createLoginToken({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isLoggedIn: user.isLoggedIn,
        isAdmin: user.isAdmin
      });

      res.status(200).json({
        message: 'OTP verified successfully',
        loginToken
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error in verifying OTP', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
