import { Router } from 'express';
import { getPayments, updatePaymentStatus, createPayment } from '../controllers/paymentController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getPayments);
router.post('/', protect, requireRole('admin'), createPayment);
router.put('/:id', protect, requireRole('admin'), updatePaymentStatus);

export default router;
