import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/model/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  await connectDB();

  const { messageId } = params;
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
