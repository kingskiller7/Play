import User from "../models/User.js";
import JWT from "../config/jwt.js";
import { sendEmail } from "../config/nodemailer.js";
import env from "../config/env.js";
import bcrypt from "bcryptjs";

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });
      console.log(user);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        details: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }
      const access_token = JWT.generateToken(user, "accessToken");
      const refresh_token = JWT.generateToken(user, "refreshToken");
      user.tokens = user.tokens.concat({ access_token, refresh_token });
      await user.save();

      const tokens = { access_token, refresh_token };
      console.log(tokens);
      res.status(200).json({
        success: true,
        message: "Login successful.",
        tokens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Invalid credentials.',
        details: error.message
      });
    }
  },

  async logout(req, res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  },

  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({
        success: false,
        error: 'User not found'
      });
      console.log(user);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile.',
        details: error.message
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { userId } = req.user._id;
      const { name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
      );
      console.log(updatedUser);
      res.status(200).json(
        {
          success: true,
          message: "Profile updated successfully",
          updatedUser
        }
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        details: error.message
      });
    }
  },

  async changePassword(req, res) {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!user || !(isMatch)) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect.'
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      console.log(user);
      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to change password',
        details: error.message
      });
    }
  },

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({
        success: false,
        error: 'User not found'
      });

      const token = JWT.generateToken(user, "accessToken");
      const resetUrl = `${env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
      await sendEmail(email, 'Password Reset Request', `Reset your password: ${resetUrl}`);
      console.log(token);

      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to email.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to request password reset.',
        details: error.message
      });
    }
  },
};

export default AuthController;