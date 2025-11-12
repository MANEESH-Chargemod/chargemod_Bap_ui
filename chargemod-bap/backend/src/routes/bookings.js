import express from 'express';
import { 
  createBooking, 
  confirmBooking, 
  getBooking,
  cancelBooking,
  getUserBookings 
} from '../controllers/bookings.js';

const router = express.Router();

router.post('/', createBooking);
router.post('/confirm', confirmBooking);
router.post('/:bookingId/cancel', cancelBooking);
router.get('/:bookingId', getBooking);
router.get('/user/:userId', getUserBookings);

export default router;