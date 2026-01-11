// models/ApprovalPoll.ts
import mongoose, { Schema, model, models } from "mongoose";
const AvatarSchema = new Schema(
  {
    public_id: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
); // no extra _id field

interface Voter {
  userId?: string;
  fingerprint: string;
  choice: "yes" | "no" | "undecided";
  votedAt: Date;
}

const VoterSchema = new Schema<Voter>({
  userId: { type: String },
  fingerprint: { type: String, required: true },
  choice: { type: String, enum: ["yes", "no", "undecided"], required: true },
  votedAt: { type: Date, default: Date.now },
});

const ApprovalPollSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Prime Minister Approval Rating",
    },
    avatar: { type: AvatarSchema, default: () => ({}) },
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    undecided: { type: Number, default: 0 },

    voters: [VoterSchema], // track voters & avoid duplicate voting
  },
  { timestamps: true }
);

export default mongoose.models.ApprovalPoll ||
  model("ApprovalPoll", ApprovalPollSchema);
