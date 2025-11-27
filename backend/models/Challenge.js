import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    points: { type: Number, default: 100 },
    difficulty: { type: String },
    flagHash: { type: String, required: true }, // bcrypt hash of the flag
    visible: { type: Boolean, default: true },
    author: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
