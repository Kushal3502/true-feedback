import { connectDB } from "@/lib/db";
import UserModel from "@/model/User.model";
import { usernameSchemaValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameSchemaValidation,
});

// this method checks the uniqueness
export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // get from url
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    // if no username is given
    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 }
      );
    }

    // validate the format
    const validationResponse = usernameQuerySchema.safeParse({ username });
    console.log(validationResponse);

    if (!validationResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username format",
        },
        { status: 400 }
      );
    }

    // check the database
    const isUserExists = await UserModel.findOne({
      username: username.toLowerCase(),
      isVerified: true,
    });

    // return response
    if (isUserExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unique username error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
