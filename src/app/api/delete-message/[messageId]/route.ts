import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // adjust path if your auth options path differs
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params?: { messageId?: string } } = {}
) {
  await dbConnect();

  // 1) session check
  const session = await getServerSession(authOptions);
  const user = session?.user as { _id?: string } | undefined;
  if (!session || !user?._id) {
    console.error("DELETE /api/delete-message - not authenticated");
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  // 2) try params.messageId first
  let messageId = params?.messageId;

  // 3) if missing, try to parse from request.url (fallback)
  if (!messageId) {
    try {
      const url = new URL(request.url);
      const parts = url.pathname.split("/").filter(Boolean); // e.g. ["api","delete-message","<id>"]
      // last segment likely the id
      messageId = parts.length ? parts[parts.length - 1] : undefined;
      console.warn("params.messageId missing — parsed from URL:", messageId);
    } catch (err) {
      console.error("Failed to parse request.url for messageId:", err);
    }
  }

  if (!messageId) {
    console.error("DELETE /api/delete-message - Missing messageId after fallback");
    return NextResponse.json({ success: false, message: "Missing messageId" }, { status: 400 });
  }

  // 4) normalize: if client sent a full object or encoded string, strip possible characters
  messageId = String(messageId);

  // 5) validate as Mongo ObjectId (safe conversion)
  let objectId: mongoose.Types.ObjectId;
  try {
    objectId = new mongoose.Types.ObjectId(messageId);
  } catch (err) {
    console.error("Invalid messageId:", messageId, err);
    return NextResponse.json({ success: false, message: "Invalid messageId" }, { status: 400 });
  }

  // 6) perform update
  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: objectId } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
