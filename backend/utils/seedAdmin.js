import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js"; // Assure-toi que ton User est aussi un ES module
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

console.log(process.env.PORT);
const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    await User.deleteMany({ username: "admin" });

    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user seeded!");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

seedAdmin();
