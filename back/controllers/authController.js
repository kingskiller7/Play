import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const newUser = await User.create({ name, email, password, role });
    const token = generateToken(newUser.id);

    res.status(201).json({ token, user: { id: newUser.id, name, email, role } });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
};