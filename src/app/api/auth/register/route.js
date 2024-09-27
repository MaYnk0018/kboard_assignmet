
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
    console.log("Request Body:", body); // Debugging statement to check if body is parsed correctly

    const { firstName, lastName, email, mobile, password } = body;
    console.log(" Body:", lastName); 
    // Check if all required fields are present
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await UserAuth.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: `User with ${email} already exists.` },
        { status: 400 }
      );
    }

    // Create a hashed password and new user document
    const hashedPassword = await createHash(password);
    console.log("Hashed Password:", hashedPassword); // Debugging statement to verify password hashing

    const newUser = new UserAuth({
      firstName,
      lastName,
      mobile,
      email,
      password: hashedPassword,
      isLoggedIn: false,
    });

    // Save the new user to the database
    await newUser.save();
    console.log("New User Created:", newUser); // Debugging statement to verify user creation

    // Return a success response
    return NextResponse.json(
      { message: "User created successfully", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error); // Log the error for debugging
    // Return an internal server error response
    return NextResponse.json(
      {
        message: "Internal server error in user registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
