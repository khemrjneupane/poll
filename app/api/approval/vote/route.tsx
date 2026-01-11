// app/api/approval/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";
import dbConnect from "@/backend/config/dbConnect";
import ApprovalPoll from "@/backend/models/approvalPoll";
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { choice } = body; // yes, no, undecided

    if (!["yes", "no", "undecided"].includes(choice)) {
      return NextResponse.json(
        { success: false, message: "Invalid choice" },
        { status: 400 }
      );
    }

    const poll = await ApprovalPoll.findOne();
    if (!poll) {
      return NextResponse.json(
        { success: false, message: "No approval poll exists" },
        { status: 404 }
      );
    }

    // Extract fingerprint
    const fingerprint = (await cookies()).get("fingerprint")?.value || null;
    if (!fingerprint) {
      return NextResponse.json(
        { success: false, message: "Fingerprint missing" },
        { status: 400 }
      );
    }

    // Check fingerprint
    const alreadyVotedFingerprint = await ApprovalPoll.findOne({
      "voters.fingerprint": { $eq: fingerprint },
    });

    if (alreadyVotedFingerprint) {
      return NextResponse.json(
        { success: false, message: "You have already voted" },
        { status: 403 }
      );
    }

    // Check userId (optional)
    const userId = session?.user?.id;
    if (userId) {
      const alreadyVotedUser = await ApprovalPoll.findOne({
        "voters.userId": userId,
      });

      if (alreadyVotedUser) {
        return NextResponse.json(
          { success: false, message: "You have already voted" },
          { status: 403 }
        );
      }
    }

    // Increment logic
    const updateField: {
      $inc: { yes?: number; no?: number; undecided?: number };
      $push: {
        voters: {
          userId?: string;
          fingerprint: string;
          choice: string;
          votedAt: Date;
        };
      };
    } =
      choice === "yes"
        ? {
            $inc: { yes: 1 },
            $push: {
              voters: {
                userId,
                fingerprint,
                choice,
                votedAt: new Date(),
              },
            },
          }
        : choice === "no"
        ? {
            $inc: { no: 1 },
            $push: {
              voters: {
                userId,
                fingerprint,
                choice,
                votedAt: new Date(),
              },
            },
          }
        : {
            $inc: { undecided: 1 },
            $push: {
              voters: {
                userId,
                fingerprint,
                choice,
                votedAt: new Date(),
              },
            },
          };

    const updatedPoll = await ApprovalPoll.findOneAndUpdate({}, updateField, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      message: "Vote submitted",
      poll: updatedPoll,
    });
  } catch (error) {
    console.error("PUT approval vote error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
