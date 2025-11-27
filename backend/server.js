import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import challengeRoutes from "./routes/challenges.js";
import submitRoutes from "./routes/submit.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import adminRoutes from "./routes/admin.js";
import path from "path";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submit", submitRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/scoreboard", async (req, res) => {
  // Simple scoreboard: top 50 by points
  const User = (await import("./models/User.js")).default;
  const top = await User.find({ role: "user" })
    .select("username points")
    .sort({ points: -1 })
    .limit(50);
  res.json(top);
});

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
