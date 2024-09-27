import { connectDB } from "../../../../lib/mongo";
import { UserAuth } from "../../../../models/dbconfig";
import { createHash, hashCompare } from "../../../../helper/hash"; // Corrected import
import auth from "../../../../helper/auth";
import { NextResponse } from "next/server";

export async function POST(Request) {
  await connectDB();

  try {
    const { email, password, confirmPassword } = Request.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords don't match" },{status: 400});
     
    }

    // Find the user by email
    const user = await UserAuth.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "email not found" },{status: 400})
    }

    // Update the user's password
    const hashedPassword = await hash.createHash(password);
    user.password = hashedPassword;  // This was the correction: use `user.password` instead of `UserAuth.password`
    await user.save();

    return NextResponse.json({ message: "Passwords updated successfully" },{status: 200})
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error in updating password' },{status: 500})
  }
};
