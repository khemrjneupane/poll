import mongoose, { Schema, model, Document } from "mongoose";

interface IPopularCandidate extends Document {
  name: string;
  surname: string;
  age: number;
  party?: string;
  group: "party" | "independent";
  province: string;
  category: string;
  votes: number;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  voters: {
    fingerprint: string;
    userId?: string;
  }[];
}

const popularCandidateSchema = new Schema<IPopularCandidate>({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  surname: { type: String, required: true, minlength: 1, maxlength: 100 },
  age: { type: Number, required: true, min: 18, max: 120 },
  party: { type: String, maxlength: 50, default: "Independent" },
  group: { type: String, enum: ["party", "independent"], required: true },
  category: { type: String, required: true },
  province: { type: String, required: true },
  votes: { type: Number, default: 0 },
  avatar: {
    public_id: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  voters: [
    {
      fingerprint: { type: String, required: true },
      userId: { type: String, default: "" },
    },
  ],
});

export const PopularCandidate =
  mongoose.models.PopularCandidate ||
  model<IPopularCandidate>("PopularCandidate", popularCandidateSchema);
