import { Schema, model, models, Document, Types } from "mongoose";

export interface CandidateDocument extends Document {
  avatar: {
    public_id: string;
    url: string;
  };
  name: string;
  address: {
    district: string;
    // municipality: string; // Municipality / Rural Municipality
    ward: string;
    // tole?: string; // optional street/locality
  };
  surname: string;
  age: number;
  party?: string;
  group: "party" | "independent";
  province: string;
  votes?: number;
  //ipAddress: string; // only for nomination IP
  //voters: [string]; // only for storing voter's IP id
  nominator: {
    userId: Types.ObjectId;
    fingerprint: string;
    //ipAddress: string;
  };
  voters: {
    userId: Types.ObjectId;
    ipAddress: string;
  }[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const VoterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    //ipAddress: { type: String },
    fingerprint: { type: String },
  },
  { _id: false },
);
const CandidateSchema = new Schema<CandidateDocument>(
  {
    avatar: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    name: {
      type: String,
      required: true,
      minlength: [3, "First name must be longer than 2 characters"],
      unique: true,
    },
    surname: {
      type: String,
      minlength: [3, "Surname name must be longer than 2 characters"],
      required: true,
    },
    age: { type: Number, required: true },
    address: {
      district: { type: String, required: true },
      //municipality: { type: String, required: true }, // Municipality / Rural Municipality
      ward: { type: String, required: true },
      //tole: { type: String }, // optional street/locality
    },

    party: {
      type: String,
      default: "Independent",
    },
    group: { type: String, enum: ["party", "independent"], required: true },
    province: {
      type: String,
      default: "Province No. 1",
      required: true,
    },
    votes: { type: Number, default: 0 },
    //ipAddress: { type: String, required: true, unique: true }, // only for nomination IP
    nominator: {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      //ipAddress: { type: String, required: true },
      fingerprint: { type: String, unique: true, required: true },
    },
    voters: { type: [VoterSchema], default: [] }, // array of { userId, ipAddress }, // only for storing voter's IP id
    isApproved: { type: Boolean, default: false },
  },

  { timestamps: true },
);
export default models.Nominee || model("Nominee", CandidateSchema);
