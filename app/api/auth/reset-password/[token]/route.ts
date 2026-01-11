import { NextRequest } from "next/server";
import { resetPassword } from "@/backend/controllers/authControllers";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params; // ✅ await params
  return resetPassword(req, token);
}
