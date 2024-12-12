import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import SecuritySettings from '../models/SecuritySettings.js';
import Admin from '../models/Admin.js';

const AdminController = {
  async isAdmin(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === 'admin') {
        res.status(200).json({ message: 'User have admin status.' });
      } else {
        res.status(401).json({ error: "User doesn't have admin status." });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Failed to check admin status',
        details: error.message
      });
    }
  },

  async getUsers(res) {
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
      const { name, email, role } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, role },
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
        message: 'User deleted successfully',
        userId
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete user',
        details: error.message
      });
    }
  },

  async getActivityLogs(res) {
    try {
      const logs = await ActivityLog.find().populate('user', 'name email message');
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch activity logs',
        details: error.message
      });
    }
  },

  async getSecuritySettings(res) {
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
      const { passwordMinLength, requireSpecialChars } = req.body;
      const updatedSettings = await SecuritySettings.findOneAndUpdate(
        {},
        { passwordMinLength, requireSpecialChars, updatedAt: Date.now() },
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
      if (user && user.role === 'admin') {
        const admin = await Admin.findOne({ id: userId });
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
      } else {
        res.status(401).json({ error: "User doesn't have admin status." });
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
      const { permissions } = req.body;
      const admin = await Admin.findOne({ id: userId });
      if (admin) {
        admin.permissions = admin.permissions.filter(permission =>!permissions.includes(permission));
        await admin.save();
        res.status(200).json({
          message: 'Permissions revoked successfully',
          admin
        });
      } else {
        res.status(404).json({ error: 'Admin not found' });
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
      const admin = await Admin.findOne({ id: userId });
      if (admin) {
        res.status(200).json({
          permissions: admin.permissions
        });
      } else {
        res.status(401).json({ error: "Admin not found." });
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