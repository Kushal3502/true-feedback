import { connectDB } from "@/lib/db";
import UserModel, { Message } from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const { username, content } = await request.json();

  if (!username || !content) {
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
    // find user
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isAcceptingMessage = user.isAcceptingMessage;

    if (!isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 400,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "New message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Message send error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
}
