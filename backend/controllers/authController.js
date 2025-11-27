import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

export async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  const existing = await User.findOne({ username });
  if (existing)
    return res.status(400).json({ error: "Username already taken" });
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ username, email, passwordHash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      points: user.points,
      solved: user.solved,
    },
  });
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials 1" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: "Invalid credentials 2" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      points: user.points,
      solved: user.solved,
    },
  });
}

export async function getProfile(req, res) {
  const user = await User.findById(req.body.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

// Update username/email
export async function updateProfile(req, res) {
  const { userId, username, email } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing user ID" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if new username is taken
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing)
        return res.status(400).json({ error: "Username already taken" });
      user.username = username;
    }

    if (email) user.email = email;
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// Update password
export async function updatePassword(req, res) {
  const { userId, oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match)
      return res.status(400).json({ error: "Old password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}


// Update theme
export async function updateTheme(req, res) {
  const { userId, theme } = req.body;
  if (!userId || !theme)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.theme = theme;
    await user.save();
    res.json({ message: "Theme updated", theme: user.theme });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
