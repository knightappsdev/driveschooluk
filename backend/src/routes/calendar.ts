import { Router } from 'express';
import {
  getInstructorCalendar,
  setInstructorAvailability,
  updateInstructorAvailability,
  deleteInstructorAvailability,
  getWeeklyScheduleTemplate,
  bulkSetAvailability,
  getAvailableTimeSlots
} from '../controllers/calendarController';

const router = Router();

// Get instructor calendar view (bookings + availability)
router.get('/instructor/:instructorId', getInstructorCalendar);

// Get instructor's weekly schedule template
router.get('/instructor/:instructorId/template', getWeeklyScheduleTemplate);

// Get available time slots for booking
router.get('/instructor/:instructorId/slots', getAvailableTimeSlots);

// Set instructor availability
router.post('/instructor/:instructorId/availability', setInstructorAvailability);

// Bulk set weekly availability
router.post('/instructor/:instructorId/availability/bulk', bulkSetAvailability);

// Update availability slot
router.patch('/availability/:availabilityId', updateInstructorAvailability);

// Delete availability slot
router.delete('/availability/:availabilityId', deleteInstructorAvailability);

export default router;