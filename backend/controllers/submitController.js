import Challenge from "../models/Challenge.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function submitFlag(req, res) {
  const { challengeId, flag } = req.body;
  if (!challengeId || !flag)
    return res.status(400).json({ error: "Missing fields" });

  const ch = await Challenge.findById(challengeId);
  if (!ch) return res.status(404).json({ error: "Challenge not found" });

  // Check if user already solved
  const alreadySolved = req.user.solved?.some(
    (id) => id.toString() === ch._id.toString()
  );
  if (alreadySolved) {
    await Submission.create({
      user: req.user._id,
      challenge: ch._id,
      correct: false,
      flag: maskFlag(flag),
      ip: req.ip,
    });
    return res.json({ correct: false, message: "Already solved" });
  }

  const ok = await bcrypt.compare(flag, ch.flagHash);
  await Submission.create({
    user: req.user._id,
    challenge: ch._id,
    correct: ok,
    flag: maskFlag(flag),
    ip: req.ip,
  });

  if (!ok)
    return res.status(400).json({ correct: false, message: "Wrong flag" });

  // mark solved + add points
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { points: ch.points },
    $push: { solved: ch._id },
  });

  return res.json({ correct: true, message: `Correct! +${ch.points} points` });
}

function maskFlag(flag) {
  // very basic masking for audit (do NOT store raw in production)
  if (!flag) return "";
  return flag.slice(0, 6) + "...";
}
