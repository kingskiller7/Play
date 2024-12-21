import express from 'express';
import authController from '../controllers/authController.js';
import authMid from '../middleware/authMiddleware.js';

const auth = express.Router();

auth.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Auth Route!' });
});
auth.post('/register',authController.register);
auth.post('/login',authController.login);
auth.post('/reset-password',authController.requestPasswordReset);
auth.post('/logout', authMid.authenticate, authController.logout);
auth.get('/profile/:id', authMid.authenticate, authController.getProfile);
auth.put('/profile/:id', authMid.authenticate, authController.updateProfile);
auth.put('/change-password', authMid.authenticate, authController.changePassword);

export default auth;