import Challenge from "../models/Challenge.js";
import bcrypt from "bcrypt";

/* Admin only - create challenge with the plaintext flag in body (server hashes it) */
export async function createChallenge(req, res) {
  const { title, description, category, difficulty, points, flag } = req.body;
  if (!title || !flag) return res.status(400).json({ error: "Missing fields" });
  const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
  const flagHash = await bcrypt.hash(flag, saltRounds);
  const ch = await Challenge.create({
    title,
    description,
    category,
    difficulty,
    points,
    flagHash,
    author: req.user.username,
  });
  res.json(ch);
}

export async function listChallenges(req, res) {
  // Only visible ones for normal users
  const challenges = await Challenge.find({ visible: true })
    .select("-flagHash")
    .sort({ points: 1 });
  res.json(challenges);
}

export async function getChallenge(req, res) {
  const ch = await Challenge.findById(req.params.id).select("-flagHash");
  if (!ch) return res.status(404).json({ error: "Not found" });
  res.json(ch);
}

// Admin updates
export async function updateChallenge(req, res) {
  const { id } = req.params;
  const payload = { ...req.body };
  if (payload.flag) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
    payload.flagHash = await bcrypt.hash(payload.flag, saltRounds);
    delete payload.flag;
  }
  const ch = await Challenge.findByIdAndUpdate(id, payload, { new: true });
  if (!ch) return res.status(404).json({ error: "Not found" });
  res.json(ch);
}

export async function deleteChallenge(req, res) {
  const ch = await Challenge.findByIdAndDelete(req.params.id);
  if (!ch) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
}
