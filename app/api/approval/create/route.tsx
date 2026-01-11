// app/api/approval/create/route.ts
import dbConnect from "@/backend/config/dbConnect";
import { uploadFile } from "@/backend/lib/cloudinary";
import ApprovalPoll from "@/backend/models/approvalPoll";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const form = await req.formData();
    const title =
      form.get("title")?.toString() || "Prime Minister Approval Rating";
    const avatarFile = form.get("avatar") as File | null;

    let avatarData: { public_id: string; url: string } | undefined = undefined;

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:${avatarFile.type};base64,${base64}`;

      const uploaded = await uploadFile(dataUrl, "approval-polls");

      avatarData = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
      console.log("uploaded", avatarData);
    }
    const created = await ApprovalPoll.create({
      title,
      avatar: avatarData,
      yes: 0,
      no: 0,
      undecided: 0,
      voters: [],
    });
    console.log("avatar created", created);
    return NextResponse.json({ success: true, created }, { status: 201 });
  } catch (error) {
    console.error("Create approval poll error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create approval poll" },
      { status: 500 }
    );
  }
};
