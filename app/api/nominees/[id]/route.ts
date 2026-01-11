import {
  DELETE as deleteNomineeById,
  getNomineeById,
} from "@/backend/controllers/nomineesControllers";
export const DELETE = deleteNomineeById;
export const GET = getNomineeById;
