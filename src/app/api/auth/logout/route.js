import { connectDB } from "../../../../lib/mongo";
import { UserAuth } from "../../../../models/dbconfig";
import { createHash, hashCompare } from "../../../../helper/hash"; // Corrected import
import auth from "../../../../helper/auth";
import { NextResponse } from "next/server";

export async function PUT(Request) {
  await connectDB();

  try {
    // Extract the query parameter from the URL
    const { searchParams } = new URL(Request.url);
    const id = searchParams.get("id");

    // Check if the user exists
    const user = await UserAuth.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Update user state to logged out
    user.isLoggedIn = false;
    await user.save();

    // Return a success response
    return NextResponse.json({ message: "Logged out Successfully" }, { status: 200 });
  } catch (error) {
    // Handle any server errors
    return NextResponse.json(
      { message: "Internal server error in logging out" },
      { status: 500 }
    );
  }
}
