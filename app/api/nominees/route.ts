// app/api/nominees/route.ts
import { GET as getNominees } from "@/backend/controllers/nomineesControllers";
import { POST as postNominees } from "@/backend/controllers/nomineesControllers";

export const GET = getNominees;
export const POST = postNominees;
