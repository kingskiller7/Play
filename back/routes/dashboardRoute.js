import express from 'express';
import getDashboard from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getDashboard);
router.get('/admin', authenticate, authorize(['admin']), getDashboard);

export default router;