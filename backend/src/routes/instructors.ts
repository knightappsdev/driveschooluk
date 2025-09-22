import { Router } from 'express';
import { InstructorController } from '../controllers/instructorController';
import { authenticate, requireSuperAdmin, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/instructors
 * @desc    Get all instructors with filtering and pagination
 * @access  Private (Admin+)
 */
router.get(
  '/',
  requireAdmin,
  InstructorController.getAllInstructorsValidation,
  InstructorController.getAllInstructors
);

/**
 * @route   GET /api/instructors/available
 * @desc    Get available instructors for assignment
 * @access  Private (Admin+)
 */
router.get(
  '/available',
  requireAdmin,
  InstructorController.getAvailableInstructors
);

/**
 * @route   GET /api/instructors/:id
 * @desc    Get instructor by ID
 * @access  Private (Admin+)
 */
router.get(
  '/:id',
  requireAdmin,
  InstructorController.getInstructorById
);

/**
 * @route   PUT /api/instructors/:id
 * @desc    Update instructor profile
 * @access  Private (Admin+)
 */
router.put(
  '/:id',
  requireAdmin,
  InstructorController.updateInstructorValidation,
  InstructorController.updateInstructor
);

/**
 * @route   POST /api/instructors/assign
 * @desc    Assign student to instructor
 * @access  Private (Super Admin only)
 */
router.post(
  '/assign',
  requireSuperAdmin,
  InstructorController.assignStudentValidation,
  InstructorController.assignStudent
);

/**
 * @route   GET /api/instructors/:id/assignments
 * @desc    Get instructor assignments
 * @access  Private (Admin+)
 */
router.get(
  '/:id/assignments',
  requireAdmin,
  InstructorController.getInstructorAssignments
);

/**
 * @route   DELETE /api/instructors/assignments/:assignmentId
 * @desc    Unassign student from instructor
 * @access  Private (Super Admin only)
 */
router.delete(
  '/assignments/:assignmentId',
  requireSuperAdmin,
  InstructorController.unassignStudent
);

/**
 * @route   PUT /api/instructors/:id/availability
 * @desc    Update instructor availability
 * @access  Private (Admin+)
 */
router.put(
  '/:id/availability',
  requireAdmin,
  InstructorController.updateAvailability
);

export default router;