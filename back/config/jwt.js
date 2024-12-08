import jwt from "jsonwebtoken";
import env from "./env.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};