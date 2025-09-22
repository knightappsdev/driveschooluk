import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { InstructorService } from '../services/instructorService';
import { logger } from '../utils/logger';
import { body, query, validationResult } from 'express-validator';
import { AssignmentStatus } from '@prisma/client';

export class InstructorController {
  static getAllInstructorsValidation = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['all', 'active', 'inactive']),
  ];

  static assignStudentValidation = [
    body('learnerId').notEmpty().withMessage('Learner ID is required'),
    body('instructorId').notEmpty().withMessage('Instructor ID is required'),
    body('startDate').optional().isISO8601().toDate(),
    body('notes').optional().trim().isLength({ max: 1000 }),
    body('priority').optional().isIn(['HIGH', 'MEDIUM', 'LOW']),
  ];

  static updateInstructorValidation = [
    body('vehicleType').optional().trim().isLength({ min: 1, max: 100 }),
    body('experience').optional().isInt({ min: 0, max: 50 }),
    body('specializations').optional().isArray(),
    body('hourlyRate').optional().isDecimal({ decimal_digits: '0,2' }),
    body('bio').optional().trim().isLength({ max: 2000 }),
    body('qualifications').optional().trim().isLength({ max: 2000 }),
    body('isActive').optional().isBoolean(),
  ];

  static async getAllInstructors(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
        return;
      }

      const { page = 1, limit = 10, search, status } = req.query as {
        page?: number;
        limit?: number;
        search?: string;
        status?: 'all' | 'active' | 'inactive';
      };

      const result = await InstructorService.getAllInstructors(page, limit, search, status);

      res.status(200).json({
        success: true,
        message: 'Instructors retrieved successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Get all instructors controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve instructors',
      });
    }
  }

  static async getInstructorById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Instructor ID is required',
        });
        return;
      }

      const instructor = await InstructorService.getInstructorById(id);

      if (!instructor) {
        res.status(404).json({
          success: false,
          message: 'Instructor not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Instructor retrieved successfully',
        data: instructor,
      });
    } catch (error) {
      logger.error('Get instructor by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve instructor',
      });
    }
  }

  static async updateInstructor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Instructor ID is required',
        });
        return;
      }

      const instructor = await InstructorService.updateInstructor(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Instructor updated successfully',
        data: instructor,
      });
    } catch (error) {
      logger.error('Update instructor controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update instructor',
      });
    }
  }

  static async assignStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
        return;
      }

      const assignmentData = {
        ...req.body,
        assignedBy: req.user!.id,
      };

      const assignment = await InstructorService.assignStudentToInstructor(assignmentData);

      res.status(201).json({
        success: true,
        message: 'Student assigned to instructor successfully',
        data: assignment,
      });
    } catch (error) {
      logger.error('Assign student controller error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to assign student',
      });
    }
  }

  static async getInstructorAssignments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.query as { status?: string };

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Instructor ID is required',
        });
        return;
      }

      const assignments = await InstructorService.getInstructorAssignments(
        id,
        status as AssignmentStatus | undefined
      );

      res.status(200).json({
        success: true,
        message: 'Instructor assignments retrieved successfully',
        data: assignments,
      });
    } catch (error) {
      logger.error('Get instructor assignments controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve instructor assignments',
      });
    }
  }

  static async unassignStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { assignmentId } = req.params;

      if (!assignmentId) {
        res.status(400).json({
          success: false,
          message: 'Assignment ID is required',
        });
        return;
      }

      await InstructorService.unassignStudent(assignmentId, req.user!.id);

      res.status(200).json({
        success: true,
        message: 'Student unassigned successfully',
      });
    } catch (error) {
      logger.error('Unassign student controller error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to unassign student',
      });
    }
  }

  static async getAvailableInstructors(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const instructors = await InstructorService.getAvailableInstructors();

      res.status(200).json({
        success: true,
        message: 'Available instructors retrieved successfully',
        data: instructors,
      });
    } catch (error) {
      logger.error('Get available instructors controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve available instructors',
      });
    }
  }

  static async updateAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { availability } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Instructor ID is required',
        });
        return;
      }

      if (!availability || typeof availability !== 'object') {
        res.status(400).json({
          success: false,
          message: 'Valid availability data is required',
        });
        return;
      }

      await InstructorService.updateInstructorAvailability(id, availability);

      res.status(200).json({
        success: true,
        message: 'Instructor availability updated successfully',
      });
    } catch (error) {
      logger.error('Update instructor availability controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update instructor availability',
      });
    }
  }
}