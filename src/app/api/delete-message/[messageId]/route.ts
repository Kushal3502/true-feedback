import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/model/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";

type Props = {
  params: Promise<{
    messageId: string;
  }>;
};

export async function DELETE(request: NextRequest, { params }: Props) {
  await connectDB();

  // Extract `messageId` from the URL
  const { messageId } = await params;
  console.log(messageId);

  // Validate `messageId`
  if (!messageId) {
    return NextResponse.json(
      {
        success: false,
        message: "Message ID is required",
      },
      {
        status: 400,
      }
    );
  }

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

  try {
    const updatedMessage = await UserModel.updateOne(
      {
        _id: session.user._id,
      },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedMessage.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Messages not found",
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Messages deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Message delete error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting message",
      },
      {
        status: 500,
      }
    );
  }
}
