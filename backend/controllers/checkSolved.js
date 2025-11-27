import User from "../models/User.js";
import e from "express";

export async function checkSolved(req, res, next) {
  const alreadySolved = req.user.solved?.some(id => id.toString() === ch._id.toString());
  if (alreadySolved) {
    return res.json({ status: "Already solved" });
  }else {
    return res.json({ status: "Not solved" });
  }
}