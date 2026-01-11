import dbConnect from "@/backend/config/dbConnect";
import { PopularCandidate } from "@/backend/models/popularCandidate";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();

    // Fetch all candidates, sorted by votes descending
    const candidates = await PopularCandidate.find({})
      .sort({ votes: -1 })
      .lean();

    return NextResponse.json({ success: true, candidates });
  } catch (error) {
    console.error("GET /api/popular-candidate error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
