import User from "../models/User.js";
import JWT from "../config/jwt.js";
import { sendEmail } from "../config/nodemailer.js";
import env from "../config/env.js";
import bcrypt from "bcryptjs";

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (password.length < 8 || password.length > 32) {
        return res.status(400).json({
          success: false,
          message: "Password must be between 8 and 32 characters."
        });
      }

      const existingUser = await User.findOne({ $or: [{ email }, { name }] });
      if (existingUser) {
        const field = existingUser.email === email ? "Email" : "Name";
        return res.status(400).json({
          success: false,
          message: `${field} already exists!`
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const isFirstUser = (await User.countDocuments()) === 0;
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? "admin" : "user",
        isAdmin: isFirstUser,
      });
      res.status(201).json({
        success: true,
        message: isFirstUser
        ? "First user registered successfully and assigned as admin."
        : "User registered successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Registration failed.",
        error: error.message
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
      const tokens = { access_token, refresh_token };
      res.status(200).json({
        success: true,
        message: "Login successful.",
        tokens,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        },
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
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.status(200).json({
        success: true,
        message: "Logout successful."
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Logout failed.",
        error: error.message
      });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({
        success: false,
        error: 'User not found'
      });
      res.status(200).json({
        success: true,
        user
      });
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
      ).select("-password");

      res.status(200).json(
        {
          success: true,
          message: "Profile updated successfully",
          user: updatedUser,
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
      if (newPassword.length < 8 || newPassword.length > 32) {
        return res.status(400).json({
          success: false,
          message: "Password must be between 8 and 32 characters."
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
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
      await sendEmail(
        email,
        'Password Reset Request',
        `Reset your password: ${resetUrl}`
      );

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