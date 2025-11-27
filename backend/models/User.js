import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    points: { type: Number, default: 0 },
    avatar: { type: String, default: "/uploads/default.png" },
    theme: { type: String, default: "dark" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    solved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
