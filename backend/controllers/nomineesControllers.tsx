// app/api/nominees/route.ts
import { NextRequest, NextResponse } from "next/server";

import Nominee from "@/backend/models/nominee";
import dbConnect from "@/backend/config/dbConnect";
import { rateLimit } from "@/backend/lib/rateLimit";
import { getClientIp } from "@/backend/lib/getClientIp";
import { z } from "zod";
import mongoose from "mongoose";
import { uploadFile } from "../lib/cloudinary";
import transport from "../lib/sendNodeMailer";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { nomineeConfirmationTemplate } from "../lib/nomineeConfirmationTemplate";
import { GetIPResponse } from "@/types/vote";
import { cookies } from "next/headers";
import { PopularCandidate } from "../models/popularCandidate";

export function respond<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: status < 400,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export const getNominees = async (request: NextRequest) => {
  try {
    // Extract IP (fallbacks included)
    const ip = getClientIp(request);
    const limitCheck = rateLimit(ip);
    if (!limitCheck.success) {
      return respond(
        {
          error: `Rate limit exceeded. Try again in ${limitCheck.retryAfter}s`,
        },
        429,
      );
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const province = searchParams.get("province");
    const group = searchParams.get("group");
    const party = searchParams.get("party");
    const name = searchParams.get("name");
    const surname = searchParams.get("surname");
    const search = searchParams.get("search");

    // Build filter
    interface NomineeFilter {
      province?: string;
      group?: "party" | "independent";
      party?: string | { $regex: string; $options: string };
      name?: { $regex: string; $options: string };
      surname?: { $regex: string; $options: string };
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
    }
    const filter: NomineeFilter = {};
    if (province) filter.province = province;
    if (group) filter.group = group as "party" | "independent";
    if (party) filter.party = { $regex: party, $options: "i" };
    if (name && surname) {
      filter.$or = [
        { name: { $regex: name, $options: "i" } },
        { surname: { $regex: surname, $options: "i" } },
      ];
    } else if (name) {
      filter.name = { $regex: name, $options: "i" };
    } else if (surname) {
      filter.surname = { $regex: surname, $options: "i" };
    }

    // ✅ Merge with general search
    if (search) {
      filter.$or = [
        ...(filter.$or || []),
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { party: { $regex: search, $options: "i" } },
        { province: { $regex: search, $options: "i" } },
      ];
    }
    // Pagination
    const skip = (page - 1) * limit;

    const [nominees, total] = await Promise.all([
      Nominee.find(filter)
        .sort({ votes: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Nominee.countDocuments(filter),
    ]);

    return respond({
      nominees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/nominees error:", error);
    return respond({ error: "Internal server error" }, 500);
  }
};
/************ getNominees ends */

/************ postNominees starts */

// POST Nominees

const nomineeSchema = z.object({
  avatar: z
    .object({
      public_id: z.string().optional().default(""),
      url: z.string().optional().default(""),
    })
    .optional(),
  name: z.string().min(3).max(100),
  surname: z.string().min(1).max(100),
  age: z.number().min(18).max(120),
  //Address validation
  address: z.object({
    district: z.string().min(3).max(100),
    //municipality: z.string().min(1).max(100),
    ward: z.string().min(1).max(32),
    //tole: z.string().max(100).optional(),
  }),
  party: z.string().max(50).optional().default("Independent"),
  group: z.enum(["party", "independent"]),
  province: z.string().min(1).max(50),
  votes: z.number().min(0).optional().default(0),
  nominator: z.object({
    userId: z.string().min(1),
    fingerprint: z.string().min(10),
  }),
});

type NomineeData = z.infer<typeof nomineeSchema>;
// POST - Create new nominee
export const postNominees = async (request: NextRequest) => {
  try {
    await dbConnect();

    // Get client IP for rate limiting
    const ip = getClientIp(request);
    /*  const limitCheck = rateLimit(ip);
    if (!limitCheck.success) {
      return respond(
        {
          error: `Rate limit exceeded. Try again in ${limitCheck.retryAfter}s`,
        },
        429
      );
    }
    */

    // Parse multipart form-data instead of JSON
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const age = formData.get("age") as string;
    const group = formData.get("group") as "party" | "independent";
    const province = formData.get("province") as string;
    const party = formData.get("party") as string | undefined;
    // 🆕 Address fields
    const district = formData.get("district") as string;
    //const municipality = formData.get("municipality") as string;
    const ward = formData.get("ward");
    //const tole = formData.get("tole") as string | undefined;
    const avatarFile = formData.get("avatar") as File | null;
    const fingerprint = (formData.get("fingerprint") as string) || "";

    if (!fingerprint) {
      return respond({ error: "Fingerprint is required" }, 400);
    }
    if (
      !name ||
      !surname ||
      !age ||
      !group ||
      !province ||
      !district ||
      //!municipality ||
      !ward
    ) {
      return respond({ error: "Missing required fields" }, 400);
    }

    let avatarData = undefined;
    if (avatarFile) {
      // Convert File -> Buffer -> base64 (for Cloudinary)
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${avatarFile.type};base64,${buffer.toString(
        "base64",
      )}`;

      const uploaded = await uploadFile(base64Data, "nominee_avatars");
      avatarData = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
    }
    // Get session to include userId in voters
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }
    const nomineeDataWithIP = {
      name,
      surname,
      age: Number(age),
      group,
      province,
      party: group === "party" ? party : undefined,
      avatar: avatarData || { public_id: "", url: "" }, // ✅ always present
      //address: { district, municipality, ward, tole },
      address: { district, ward },
      //ipAddress: ip,
      //nominator: { userId: session.user.id, ipAddress: ip, fingerprint },
      nominator: { userId: session.user.id, fingerprint },
      voters: [{ userId: session.user.id, fingerprint }], //fingerprint
    };

    // ✅ Validate using zod schema
    const validationResult = nomineeSchema.safeParse(nomineeDataWithIP);
    if (!validationResult.success) {
      return respond(
        {
          error: "Invalid data",
          details: validationResult.error.issues,
        },
        400,
      );
    }

    const nomineeData: NomineeData = validationResult.data;

    // ✅ Check for duplicate IP

    const existingNominee = await Nominee.findOne({
      $or: [
        { "nominator.fingerprint": nomineeData.nominator.fingerprint }, // same device
        { "nominator.userId": session?.user?.id }, // same logged-in account
      ],
    });

    if (existingNominee) {
      return respond({ error: "Only one nomination allowed for you!" }, 409);
    }
    // ✅ Create nominee
    const nominee = await Nominee.create(nomineeData);

    await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: session.user.email ?? "",
      subject: `(no-reply@votenepal.net) ✅ ${nominee.name} ${nominee.surname} nominated successfully`,
      html: nomineeConfirmationTemplate(nominee),
    });

    return respond({ success: true, nominee }, 201);
  } catch (error: unknown) {
    console.error("POST /api/nominees error:", error);

    // Type guard for Mongoose ValidationError
    if (error instanceof mongoose.Error.ValidationError) {
      return respond({ error: "Validation error" }, 400);
    }

    // Type guard for MongoServerError (duplicate key)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "keyValue" in error &&
      (error as { code: number; keyValue: Record<string, unknown> }).code ===
        11000
    ) {
      const err = error as { code: number; keyValue: Record<string, unknown> };
      const duplicateField = Object.keys(err.keyValue)[0];
      return respond(
        {
          error: `${duplicateField}: ${err.keyValue[duplicateField]} - already nominated!`,
        },
        409,
      );
    }

    return respond({ error: "Internal server error" }, 500);
  }
};

/*************************************************************************************** 
                                    Vote Nominees
****************************************************************************************/

export const putNomineeVote = async (req: NextRequest, nomineeId: string) => {
  const session = await getServerSession(authOptions);
  try {
    await dbConnect();
    // 🧩 Read fingerprint from client header or cookie
    const fingerprint = (await cookies()).get("fingerprint")?.value || null;
    const ipAlreadyVoted = await Nominee.findOne({
      "voters.fingerprint": { $eq: fingerprint },
    });

    if (ipAlreadyVoted) {
      return NextResponse.json(
        { success: false, message: "You have already voted" },
        { status: 403 },
      );
    }

    // Check if this user already voted (extra safeguard)
    const userId = session?.user?.id;
    const userAlreadyVoted = userId
      ? await Nominee.findOne({ "voters.userId": userId })
      : null;

    if (userAlreadyVoted) {
      return NextResponse.json(
        { success: false, message: "You have already voted" },
        { status: 403 },
      );
    }

    // Increment votes + add voter record
    const nominee = await Nominee.findByIdAndUpdate(
      nomineeId,
      {
        $inc: { votes: 1 },
        $push: { voters: { userId: session?.user.id, fingerprint } },
      },
      { new: true },
    );

    if (!nominee) {
      return NextResponse.json(
        { success: false, message: "Nominee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Vote successful", nominee },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/nominees/vote error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cast vote" },
      { status: 500 },
    );
  }
};

/*************************************************************************************** 
                              Vote Popular Candidate
****************************************************************************************/

export const putPopularCandidateVote = async (
  req: NextRequest,
  popCandidateId: string,
) => {
  const session = await getServerSession(authOptions);
  try {
    await dbConnect();
    // 🧩 Read fingerprint from client header or cookie
    const fingerprint = (await cookies()).get("fingerprint")?.value || null;
    const ipAlreadyVoted = await PopularCandidate.findOne({
      "voters.fingerprint": { $eq: fingerprint },
    });

    if (ipAlreadyVoted) {
      return NextResponse.json(
        { success: false, message: "You have already voted someone!" },
        { status: 403 },
      );
    }

    // Check if this user already voted (extra safeguard)
    const userId = session?.user?.id;
    const userAlreadyVoted = userId
      ? await PopularCandidate.findOne({ "voters.userId": userId })
      : null;

    if (userAlreadyVoted) {
      return NextResponse.json(
        { success: false, message: "You have already voted someone!" },
        { status: 403 },
      );
    }

    // Increment votes + add voter record
    const popCandidate = await PopularCandidate.findByIdAndUpdate(
      popCandidateId,
      {
        $inc: { votes: 1 },
        $push: { voters: { userId: session?.user.id, fingerprint } },
      },
      { new: true },
    );

    if (!popCandidate) {
      return NextResponse.json(
        { success: false, message: "popCandidate not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Vote successful", popCandidate },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/popCandidates/vote error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cast vote for pupular candidate" },
      { status: 500 },
    );
  }
};

//update put nominee's votes ends

// UPDATE - Admin-only update nominee function starts
// UPDATE - Admin-only update nominee (NO VALIDATION)
export const updateNominees = async (req: NextRequest, nomineeId: string) => {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    if (!nomineeId) {
      return respond({ error: "Nominee ID is required" }, 400);
    }

    const existingNominee = await Nominee.findById(nomineeId);
    if (!existingNominee) {
      return respond({ error: "Nominee not found" }, 404);
    }

    // Parse incoming formdata
    const formData = await req.formData();

    const updateData: Record<string, string | number | object> = {};

    // Apply simple extraction helper
    const set = (key: string) => {
      const value = formData.get(key);
      if (value !== null && value !== undefined && value !== "") {
        updateData[key] = value;
      }
    };

    // Simple text/number fields
    set("name");
    set("surname");
    set("age");
    set("group");
    set("province");
    set("party");
    set("district");
    //set("municipality");
    set("ward");
    //set("tole");

    // Fix numeric fields
    if (updateData.age) updateData.age = Number(updateData.age);
    if (updateData.ward) updateData.ward = updateData.ward;

    // Build address if needed
    if (updateData.district || updateData.ward) {
      updateData.address = {
        district: updateData.district ?? existingNominee.address.district,
        //municipality:
        //updateData.municipality ?? existingNominee.address.municipality,
        ward: updateData.ward ?? existingNominee.address.ward,
        //tole: updateData.tole ?? existingNominee.address.tole,
      };
    }

    // Remove plain fields that belong only in address
    delete updateData.district;
    //delete updateData.municipality;
    delete updateData.ward;
    //delete updateData.tole;

    // Handle avatar upload
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${avatarFile.type};base64,${buffer.toString(
        "base64",
      )}`;

      const uploaded = await uploadFile(base64, "nominee_avatars");
      updateData.avatar = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
    }

    // NEVER allow admin to update these
    delete updateData.nominator;
    delete updateData.voters;

    // Perform update
    const updatedNominee = await Nominee.findByIdAndUpdate(
      nomineeId,
      updateData,
      { new: true },
    );

    return respond({ success: true, nominee: updatedNominee }, 200);
  } catch (error) {
    console.error("PATCH /api/nominees/[id]/update error:", error);
    return respond({ error: "Internal server error" }, 500);
  }
};

// UPDATE - Admin-only update nominee function ends

// admin authenticate nominee starts
export const adminAuthenticateNominee = async (
  req: NextRequest,
  nomineeId: string,
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 },
      );
    }

    const { isApproved } = await req.json();

    await dbConnect();

    const nominee = await Nominee.findById(nomineeId);
    if (!nominee) {
      return NextResponse.json(
        { success: false, message: "Nominee not found" },
        { status: 404 },
      );
    }

    nominee.isApproved = isApproved;
    await nominee.save();

    return NextResponse.json({
      success: true,
      message: `Nominee has been ${isApproved ? "approved" : "rejected"}`,
      data: nominee,
    });
  } catch (error) {
    console.error("Failed to approve/reject nominee:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
};

// admin authenticate nominee ends

//DeletenomineebyId begins
export const deleteNomineeById = async (
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
) => {
  try {
    await dbConnect();
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Nominee ID is required" },
        { status: 400 },
      );
    }
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 },
      );
    }
    const nominee = await Nominee.findById(id);

    if (!nominee) {
      return NextResponse.json(
        { success: false, error: "Nominee not found" },
        { status: 404 },
      );
    }

    await nominee.deleteOne();

    return NextResponse.json({
      success: true,
      data: `Nominee named: ${nominee.name},  deleted`,
    });
  } catch (err) {
    console.error("DELETE nominee error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
};

// DELETE Nominees by Id ends

// GET nominee by ID

export const getNomineeById = async (
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
) => {
  try {
    await dbConnect();
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Nominee ID is required" },
        { status: 400 },
      );
    }

    const nominee = await Nominee.findById(id);

    if (!nominee) {
      return NextResponse.json(
        { success: false, error: "Nominee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: nominee });
  } catch (err) {
    console.error("GET nominee by ID error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
};
export const getNomineeByVoterId = async (
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
) => {
  try {
    await dbConnect();
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Nominee ID is required" },
        { status: 400 },
      );
    }

    const nominee = await Nominee.findOne({
      "voters.userId": id,
    });

    if (!nominee) {
      return NextResponse.json(
        { success: false, error: "No nominee found for this voter" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: nominee });
  } catch (err) {
    console.error("GET nominee by voter error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
};
// OPTIONS - CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "GET, POST, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
//Get Client IP

export const getIP = async (request: NextRequest) => {
  try {
    await dbConnect();

    const ip = getClientIp(request);
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const fingerprint = (await cookies()).get("fingerprint")?.value ?? null;
    console.log("fingerprint", fingerprint);

    // Build safe OR conditions (no {} defaults)
    const nominatorOr: Record<string, unknown>[] = [];
    if (userId) nominatorOr.push({ "nominator.userId": userId });
    if (fingerprint) nominatorOr.push({ "nominator.fingerprint": fingerprint });

    const voterOr: Record<string, unknown>[] = [];
    if (userId) voterOr.push({ "voters.userId": userId });
    if (fingerprint) voterOr.push({ "voters.fingerprint": fingerprint });

    // If no identity info at all, bail out early
    if (nominatorOr.length === 0 && voterOr.length === 0) {
      return NextResponse.json<GetIPResponse>(
        {
          success: false,
          fingerprint: "",
          messageVoted:
            "No fingerprint or userId found => You have not voted anyone!",
          messageNominated:
            "No fingerprint or userId found => You have not nominated anyone!",
        },
        { status: 400 },
      );
    }

    // Run both queries in parallel (skip query when its OR array is empty)
    const [nomineeByIdentity, nomineeVoted] = await Promise.all([
      nominatorOr.length
        ? Nominee.findOne({ $or: nominatorOr })
        : Promise.resolve(null),
      voterOr.length
        ? Nominee.findOne({ $or: voterOr })
        : Promise.resolve(null),
    ]);

    const response: GetIPResponse = {
      success: false, // updated below
      fingerprint: fingerprint ?? "",
      youNominatedNominee: null,
      youVotedNominee: null,
      voter: null,
      nominatedObject: undefined,
      votedObject: undefined,
      // optional message fields
    };

    // Nomination result
    if (nomineeByIdentity) {
      response.youNominatedNominee = {
        id: nomineeByIdentity._id.toString(),
        name: nomineeByIdentity.name,
        surname: nomineeByIdentity.surname,
        party: nomineeByIdentity.party,
      };
      response.nominatedObject = nomineeByIdentity;
    } else {
      response.messageNominated = "You have not nominated any candidate yet";
    }

    // Voting result
    if (nomineeVoted) {
      // find the exact voter entry inside the voters array
      const voter = nomineeVoted.voters.find(
        (v: { userId?: string; ipAddress?: string; fingerprint?: string }) =>
          (userId && v.userId?.toString() === userId) ||
          (fingerprint && v.fingerprint === fingerprint),
      );

      if (voter) {
        response.youVotedNominee = {
          id: nomineeVoted._id.toString(),
          name: nomineeVoted.name,
          surname: nomineeVoted.surname,
          party: nomineeVoted.party,
        };
        response.voter = voter ?? null;
        response.votedObject = nomineeVoted;
      } else {
        // matched a document by voters.* field, but couldn't find the exact array entry
        response.messageVoted = "You have not voted for any candidate yet";
      }
    } else {
      response.messageVoted = "You have not voted for any candidate yet";
    }

    // success = true if either nomination or voting info exists for the user
    response.success = Boolean(
      response.youNominatedNominee || response.youVotedNominee,
    );

    // If neither found, you can return 200 with success:false or 404 — here we keep 200
    if (!response.success) {
      response.fingerprint = ""; // optional: clear fingerprint when nothing found
      return NextResponse.json<GetIPResponse>(response, { status: 200 });
    }

    // found something
    return NextResponse.json<GetIPResponse>(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get IP:", error);
    return NextResponse.json<GetIPResponse>(
      {
        success: false,
        fingerprint: "",
        messageNominated: "Internal server error",
      },
      { status: 500 },
    );
  }
};

export { getNominees as GET };
export { postNominees as POST };
export { deleteNomineeById as DELETE };
