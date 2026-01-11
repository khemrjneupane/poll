// app/api/approval/route.ts
import dbConnect from "@/backend/config/dbConnect";
import ApprovalPoll from "@/backend/models/approvalPoll";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const poll = await ApprovalPoll.findOne();

    if (!poll) {
      return NextResponse.json(
        { success: false, message: "No poll found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, poll });
  } catch (error) {
    console.error("GET approval poll error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}
