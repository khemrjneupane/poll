import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/backend/config/dbConnect";
import { authOptions } from "@/backend/lib/auth";
import { uploadFile } from "@/backend/lib/cloudinary";
import { PopularCandidate } from "@/backend/models/popularCandidate";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admin can create popular candidates" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const age = Number(formData.get("age"));
    const group = formData.get("group") as "party" | "independent";
    const category = formData.get("category") as string;
    const province = formData.get("province") as string;
    const party = formData.get("party") as string | undefined;
    const avatarFile = formData.get("avatar") as File | null;

    if (!name || !surname || !age || !group || !province || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let avatarData;
    if (avatarFile) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${avatarFile.type};base64,${buffer.toString(
        "base64"
      )}`;
      avatarData = await uploadFile(base64Data, "candidate_avatars");
    }

    const candidate = await PopularCandidate.create({
      name,
      surname,
      age,
      group,
      category,
      province,
      party: group === "party" ? party : "Independent",
      avatar: avatarData
        ? { public_id: avatarData.public_id, url: avatarData.url }
        : undefined,
      votes: 0,
      voters: [],
    });

    return NextResponse.json({ success: true, candidate }, { status: 201 });
  } catch (error) {
    console.error("POST /popular-candidates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
