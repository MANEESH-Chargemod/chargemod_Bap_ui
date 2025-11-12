import express from 'express';
import { processPayment, getPaymentStatus } from '../controllers/payments.js';

const router = express.Router();

router.post('/process', processPayment);
router.get('/:paymentId/status', getPaymentStatus);

export default router;