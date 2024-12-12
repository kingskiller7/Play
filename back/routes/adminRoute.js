import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import checkPermissions from '../middleware/permissionMiddleware.js';

const admin = express.Router();
admin.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Admin Route!' });
});
admin.use(authenticate);

admin.get(
    '/is-admin',
    checkPermissions(['view_admin']),
    authorize,
    adminController.isAdmin
);
admin.get(
    '/users',
    checkPermissions(['manage_users']),
    adminController.getUsers
);
admin.put(
    '/users/:userId',
    checkPermissions(['manage_users']),
    adminController.updateUser
);
admin.delete(
    '/users/:userId',
    checkPermissions(['manage_users']),
    adminController.deleteUser
);
admin.get(
    '/activity-logs',
    checkPermissions(['view_logs']),
    adminController.getActivityLogs
);
admin.get(
    '/security-settings',
    checkPermissions(['manage_security_settings']),
    adminController.getSecuritySettings
);
admin.put(
    '/security-settings',
    checkPermissions(['manage_security_settings']),
    adminController.updateSecuritySettings
);
admin.post(
    '/grant-permissions/:userId',
    checkPermissions(['manage_permissions']),
    adminController.grantPermissions
);
admin.post(
    '/revoke-permissions/:userId',
    checkPermissions(['manage_permissions']),
    adminController.revokePermissions
);
admin.get(
    '/permissions/:userId',
    checkPermissions(['view_permissions']),
    adminController.getPermissions
);

export default admin;