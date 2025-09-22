import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  rescheduleBooking,
  getInstructorAvailability
} from '../controllers/bookingController';

const router = Router();

// Create a new booking
router.post('/', createBooking);

// Get all bookings (with optional filters)
router.get('/', getBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

// Reschedule booking
router.patch('/:id/reschedule', rescheduleBooking);

// Get instructor availability
router.get('/instructor/:instructorId/availability', getInstructorAvailability);

export default router;