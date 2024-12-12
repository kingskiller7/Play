import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const auth = express.Router();

auth.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Auth Route!' });
});
auth.post(
    '/register',
    authController.register
);
auth.post(
    '/login',
    authController.login
);
auth.post(
    '/reset-password',
    authController.requestPasswordReset
);

auth.use(authenticate);
auth.post(
    '/logout',
    authController.logout
);
auth.get(
    '/profile',
    authController.getProfile
);
auth.put(
    '/profile',
    authController.updateProfile
);
auth.put(
    '/change-password',
    authController.changePassword
);

export default auth;