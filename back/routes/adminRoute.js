import express from 'express';
import adminController from '../controllers/adminController.js';
import authMid from '../middleware/authMiddleware.js';
import checkPermissions from '../middleware/permissionMiddleware.js';

const admin = express.Router();
admin.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Admin Route!' });
});

admin.get(
    '/users',
    authMid.authenticate,
    checkPermissions(['manage_users']),
    adminController.getUsers
);
admin.put(
    '/users/:userId',
    authMid.authenticate,
    checkPermissions(['manage_users']),
    adminController.updateUser
);
admin.delete(
    '/users/:userId',
    authMid.authenticate,
    checkPermissions(['manage_users']),
    adminController.deleteUser
);
admin.get(
    '/activity-logs',
    authMid.authenticate,
    checkPermissions(['view_logs']),
    adminController.getActivityLogs
);
admin.get(
    '/security-settings',
    authMid.authenticate,
    checkPermissions(['manage_security_settings']),
    adminController.getSecuritySettings
);
admin.put(
    '/security-settings',
    authMid.authenticate,
    checkPermissions(['manage_security_settings']),
    adminController.updateSecuritySettings
);
admin.post(
    '/grant-permissions/:userId',
    authMid.authenticate,
    checkPermissions(['manage_permissions']),
    adminController.grantPermissions
);
admin.post(
    '/revoke-permissions/:userId',
    authMid.authenticate,
    checkPermissions(['manage_permissions']),
    adminController.revokePermissions
);
admin.get(
    '/permissions/:userId',
    authMid.authenticate,
    checkPermissions(['view_permissions']),
    adminController.getPermissions
);

export default admin;