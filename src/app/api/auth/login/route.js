import { connectDB } from "../../../../lib/mongo";
import { UserAuth } from "../../../../models/dbconfig";
import { createHash, hashCompare } from "../../../../helper/hash"; // Corrected import
import auth from "../../../../helper/auth";
import { NextResponse } from "next/server";

export async function POST(Request) {
  await connectDB();

  try {
    // Parse the request body correctly
    const body = await Request.json();
    const { email, password } = body;

    // Find the user by email
    const User = await UserAuth.findOne({ email });
    if (!User) {
      return NextResponse.json({ message: "Email Not Found" }, { status: 400 });
    }

    // Compare the provided password with the stored one using the hashCompare function
    if (await hashCompare(password, User.password)) { // Fixed function call
      // Update user login status
      User.isLoggedIn = true;
      await User.save();

      // Create the login token
      const loginToken = await auth.createLoginToken({
        userId: User._id,
        firstName: User.firstName,
        lastName: User.lastName,
        email: User.email,
        isLoggedIn: User.isLoggedIn,
        isAdmin: User.isAdmin,
      });

      // Return success response with token
      return NextResponse.json(
        { message: "Login Successful", loginToken },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Incorrect Password" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    // Internal server error response
    return NextResponse.json(
      { message: "Internal server error in fetching email", error: error.message },
      { status: 500 }
    );
  }
}
