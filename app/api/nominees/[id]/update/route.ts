import { updateNominees } from "@/backend/controllers/nomineesControllers";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updateNominees(req, id);
}
