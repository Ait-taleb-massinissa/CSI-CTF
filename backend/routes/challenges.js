import express from "express";
import {
  createChallenge, listChallenges, getChallenge, updateChallenge, deleteChallenge
} from "../controllers/challengeController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listChallenges);
router.get("/:id", getChallenge);

// admin routes
router.post("/", authenticate, requireAdmin, createChallenge);
router.put("/:id", authenticate, requireAdmin, updateChallenge);
router.delete("/:id", authenticate, requireAdmin, deleteChallenge);

export default router;
