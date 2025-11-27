import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  correct: { type: Boolean },
  flag: { type: String }, // OPTIONAL: do NOT store in production. For auditing you can store masked or remove.
  ip: { type: String },
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
