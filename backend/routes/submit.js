import express from "express";
import { submitFlag } from "../controllers/submitController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, submitFlag);

export default router;
