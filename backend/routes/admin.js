import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import Challenge from "../models/Challenge.js";

const router = express.Router();

// Add challenge
router.post("/challenge", isAdmin, async (req, res) => {
  const challenge = await Challenge.create(req.body);
  res.json(challenge);
});

// Delete challenge
router.delete("/challenge/:id", isAdmin, async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Edit challenge
router.put("/challenge/:id", isAdmin, async (req, res) => {
  const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;
