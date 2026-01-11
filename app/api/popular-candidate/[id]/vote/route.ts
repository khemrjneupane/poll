import { putPopularCandidateVote } from "@/backend/controllers/nomineesControllers";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ must await
  return putPopularCandidateVote(req, id);
}
