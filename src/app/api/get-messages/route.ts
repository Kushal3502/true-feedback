import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import UserModel from "@/model/User.model";

export async function GET() {
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

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const data = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!data || data.length == 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No message available",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data[0].messages,
        message: "Messages fetched successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Message fetch error :: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      {
        status: 500,
      }
    );
  }
}
