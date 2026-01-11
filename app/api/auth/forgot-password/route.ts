import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "@/backend/controllers/authControllers";

export async function POST(req: NextRequest) {
  return forgotPassword(req);
}
