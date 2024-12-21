import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import SecuritySettings from '../models/SecuritySettings.js';

const AdminController = {
  async getUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch users',
        details: error.message
      });
    }
  },

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { name, email, role, isAdmin } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, role, isAdmin },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        message: 'User updated successfully',
        updatedUser
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update user',
        details: error.message
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      await User.findByIdAndDelete(userId);
      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete user',
        details: error.message
      });
    }
  },

  async getActivityLogs(req, res) {
    try {
      const { userId, startDate, endDate, activityType } = req.query;

      const query = {};
      if (userId) query.user = userId;
      if (activityType) query.activityType = activityType;
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const logs = await ActivityLog.find(query)
        .populate("user", "name email")
        .sort({ timestamp: -1 });

      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch activity logs",
        details: error.message,
      });
    }
  },

  async getSecuritySettings(req, res) {
    try {
      const settings = await SecuritySettings.findOne();
      res.status(200).json(settings || {
        message: 'Default settings applied'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch security settings',
        details: error.message
      });
    }
  },

  async updateSecuritySettings(req, res) {
    try {
      const { passwordLength, requireSpecialChars } = req.body;
      const updatedSettings = await SecuritySettings.findOneAndUpdate(
        {},
        { passwordLength, requireSpecialChars, updatedAt: Date.now() },
        { new: true, upsert: true }
      );
      res.status(200).json({
        updatedSettings,
        message: 'Security settings updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update security settings',
        details: error.message
      });
    }
  },

  async grantPermissions(req, res) {
    try {
      const { userId } = req.params;
      const { permissions } = req.body;
      const user = await User.findById(userId);
      const admin = user.isAdmin;
      if (!admin) {
        return res.status(403).json({
          error: 'Unauthorized: Only admins can grant permissions.'
        });
      } else {
        if (admin) {
          admin.permissions = Array.from(new Set([...admin.permissions, ...permissions]));
          await admin.save();
          res.status(200).json({
            message: 'Permissions granted successfully.',
            admin
          });
        } else {
          const newAdmin = new Admin({
            id: userId,
            permissions
          });
          await newAdmin.save();
          res.status(201).json({
            message: 'Permissions granted successfully.',
            newAdmin
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        error: 'Failed to grant permissions.',
        details: error.message
      });
    }
  },

  async revokePermissions(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const { permissions } = req.body;
      const admin = user.isAdmin;
      if (!admin) {
        res.status(404).json({
          error: 'Admin not found'
        });
      } else {
        admin.permissions = admin.permissions.filter(permission => !permissions.includes(permission));
        await admin.save();
        res.status(200).json({
          message: 'Permissions revoked successfully',
          admin
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Failed to revoke permissions',
        details: error.message
      });
    }
  },

  async getPermissions(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const admin = user.isAdmin;
      if (!admin) {
        res.status(404).json({
          error: 'Admin not found'
        });
      } else {
        res.status(200).json({
          permissions: admin.permissions
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch permissions.',
        details: error.message
      });
    }
  }
};

export default AdminController;