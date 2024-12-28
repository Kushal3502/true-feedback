import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { connectDB } from "@/lib/db";

// method to toggle message accept status
export async function POST(request: NextRequest) {
  await connectDB();

  // get session
  const session = await getServerSession(authOptions);

  // if false -> user not authenticated
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "User not authenticated",
      },
      {
        status: 400,
      }
    );
  }

  // get user from session
  const user = session.user;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { acceptMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
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

    return NextResponse.json(
      {
        success: true,
        message: "Message accept status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Accept message error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}

// method to get message accept status
export async function GET(request: NextRequest) {
  await connectDB();

  // get session
  const session = await getServerSession(authOptions);

  // if false -> user not authenticated
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "User not authenticated",
      },
      {
        status: 400,
      }
    );
  }

  // get user from session
  const user = session.user;

  try {
    const currUser = await UserModel.findById(user._id);

    if (!currUser) {
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

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: currUser.isAcceptingMessage,
        message: "Message accept status fetched successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Accept message error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
