import { connectDB } from "@/lib/db";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  // connect database
  await connectDB();

  // extract data
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "All fields are required and cannot be empty",
      },
      {
        status: 400,
      }
    );
  }

  try {
    // find user with verified username
    const isUserAlreadyExistsWithVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // if found -> return
    if (isUserAlreadyExistsWithVerifiedUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Account already exists with this username",
        },
        {
          status: 400,
        }
      );
    }

    // find user with email
    const isUserAlreadyExistsWithEmail = await UserModel.findOne({ email });

    const verificationCode = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    if (isUserAlreadyExistsWithEmail) {
      if (isUserAlreadyExistsWithEmail.isVerified) {
        // user already verified
        return NextResponse.json(
          {
            success: false,
            message: "Account already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        // update the code, expiry and password of new user
        const hashedPassword = await bcrypt.hash(password, 10);

        isUserAlreadyExistsWithEmail.password = hashedPassword;
        isUserAlreadyExistsWithEmail.verificationCode = verificationCode;
        isUserAlreadyExistsWithEmail.verificationCodeExpiry = new Date(
          Date.now() + 3600 * 1000
        );

        await isUserAlreadyExistsWithEmail.save();
      }
    } else {
      // create a new user
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiry: new Date(Date.now() + 3600 * 1000),
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Signup successful. Please verify your account",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("User signup error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong :: signup error",
      },
      {
        status: 500,
      }
    );
  }
}
