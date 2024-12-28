import { connectDB } from "@/lib/db";
import UserModel from "@/model/User.model";
import { verifySchemaValidation } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    //   receive username and code
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    console.log(decodedUsername, code);

    // if no username is given
    if (!decodedUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 }
      );
    }

    const validationResponse = verifySchemaValidation.safeParse({ code });
    console.log(validationResponse.error?.format());

    if (!validationResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code format",
        },
        { status: 400 }
      );
    }

    // check the database
    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // check code
    const isCodeCorrect = user.verificationCode === code;
    const isCodeValid = new Date(user.verificationCodeExpiry) > new Date();

    if (isCodeCorrect && isCodeValid) {
      user.isVerified = true;

      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code expired",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Verification code error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
