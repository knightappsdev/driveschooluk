import { UserRole, AssignmentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { db } from '../utils/database';
import { logger } from '../utils/logger';
import { emailService } from './emailService';
import { getSocketServer } from '../socket/socketServer';

export interface AssignStudentRequest {
  learnerId: string;
  instructorId: string;
  assignedBy: string;
  startDate?: Date;
  notes?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InstructorWithStats {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: string;
  };
  instructorLicense: string;
  vehicleType: string | null;
  experience: number | null;
  specializations?: string[];
  availability?: Record<string, unknown>;
  hourlyRate: Decimal | null;
  bio: string | null;
  qualifications: string | null;
  rating: Decimal | null;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  isActive: boolean;
  hireDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class InstructorService {
  static async getAllInstructors(
    page = 1,
    limit = 10,
    search?: string,
    status?: 'all' | 'active' | 'inactive'
  ): Promise<{ instructors: InstructorWithStats[]; total: number; pages: number }> {
    try {
      const offset = (page - 1) * limit;
      
      const whereClause: any = {
        user: {
          role: UserRole.INSTRUCTOR,
        },
      };

      // Add search filter
      if (search) {
        whereClause.user.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Add status filter
      if (status && status !== 'all') {
        whereClause.isActive = status === 'active';
      }

      const [instructors, total] = await Promise.all([
        db.instructorProfile.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                status: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
        }),
        db.instructorProfile.count({ where: whereClause }),
      ]);

      const instructorsWithStats = instructors.map(instructor => ({
        ...instructor,
        specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
        availability: instructor.availabilityNotes ? JSON.parse(instructor.availabilityNotes) : {},
      }));

      return {
        instructors: instructorsWithStats,
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Get all instructors error:', error);
      throw error;
    }
  }

  static async getInstructorById(id: string): Promise<InstructorWithStats | null> {
    try {
      const instructor = await db.instructorProfile.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
          assignments: {
            include: {
              learner: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          lessons: {
            include: {
              learner: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              scheduledAt: 'desc',
            },
            take: 10,
          },
        },
      });

      if (!instructor) {
        return null;
      }

      return {
        ...instructor,
        specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
        availability: instructor.availabilityNotes ? JSON.parse(instructor.availabilityNotes) : {},
      };
    } catch (error) {
      logger.error('Get instructor by ID error:', error);
      throw error;
    }
  }

  static async updateInstructor(
    id: string,
    updateData: {
      vehicleType?: string;
      experience?: number;
      specializations?: string[];
      availability?: Record<string, unknown>;
      hourlyRate?: number;
      bio?: string;
      qualifications?: string;
      isActive?: boolean;
    }
  ): Promise<InstructorWithStats> {
    try {
      const updateFields: any = {
        ...updateData,
        updatedAt: new Date(),
      };
      
      // Only set specializations if provided
      if (updateData.specializations) {
        updateFields.specializations = JSON.stringify(updateData.specializations);
      }
      
      // Only set availability if provided
      if (updateData.availability) {
        updateFields.availability = JSON.stringify(updateData.availability);
      }
      
      const instructor = await db.instructorProfile.update({
        where: { id },
        data: updateFields,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      });

      return {
        ...instructor,
        specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
        availability: instructor.availabilityNotes ? JSON.parse(instructor.availabilityNotes) : {},
      };
    } catch (error) {
      logger.error('Update instructor error:', error);
      throw error;
    }
  }

  static async assignStudentToInstructor(data: AssignStudentRequest): Promise<any> {
    try {
      // Check if learner and instructor exist
      const [learner, instructor] = await Promise.all([
        db.learnerProfile.findUnique({
          where: { id: data.learnerId },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
        db.instructorProfile.findUnique({
          where: { id: data.instructorId },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
      ]);

      if (!learner) {
        throw new Error('Learner not found');
      }

      if (!instructor) {
        throw new Error('Instructor not found');
      }

      if (!instructor.isActive) {
        throw new Error('Cannot assign students to inactive instructor');
      }

      // Check for existing active assignment
      const existingAssignment = await db.assignment.findFirst({
        where: {
          learnerId: data.learnerId,
          status: AssignmentStatus.ACTIVE,
        },
      });

      if (existingAssignment) {
        throw new Error('Learner is already assigned to an instructor');
      }

      // Create assignment
      const assignment = await db.assignment.create({
        data: {
          learnerId: data.learnerId,
          instructorId: data.instructorId,
          assignedBy: data.assignedBy,
          startDate: data.startDate || new Date(),
          notes: data.notes || null,
          priority: data.priority || 'MEDIUM',
          status: AssignmentStatus.ACTIVE,
        },
        include: {
          learner: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          assignedByUser: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Update instructor active students count
      await db.instructorProfile.update({
        where: { id: data.instructorId },
        data: {
          activeStudents: {
            increment: 1,
          },
        },
      });

      // Send notification email to instructor
      const instructorName = `${instructor.user.firstName} ${instructor.user.lastName}`;
      const learnerName = `${learner.user.firstName} ${learner.user.lastName}`;
      
      emailService.sendAssignmentNotification(
        instructor.user.email,
        instructorName,
        learnerName,
        {
          startDate: (data.startDate || new Date()).toLocaleDateString(),
          ...(data.notes && { notes: data.notes }),
        }
      ).catch(error => {
        logger.error('Failed to send assignment notification email:', error);
      });

      // Create notifications in database
      const instructorNotification = await db.notification.create({
        data: {
          userId: assignment.instructor.userId,
          title: 'New Student Assignment',
          message: `You have been assigned a new student: ${learnerName}`,
          type: 'ASSIGNMENT',
          metadata: JSON.stringify({
            assignmentId: assignment.id,
            learnerId: data.learnerId,
            learnerName,
            priority: data.priority,
          }),
          actionUrl: '/dashboard/assignments',
        },
      });

      const learnerNotification = await db.notification.create({
        data: {
          userId: assignment.learner.userId,
          title: 'Instructor Assignment',
          message: `You have been assigned to instructor: ${instructorName}`,
          type: 'ASSIGNMENT',
          metadata: JSON.stringify({
            assignmentId: assignment.id,
            instructorId: data.instructorId,
            instructorName,
            priority: data.priority,
          }),
          actionUrl: '/dashboard/lessons',
        },
      });

      // Send real-time notifications via Socket.IO
      try {
        const socketServer = getSocketServer();
        
        // Broadcast notifications
        await socketServer.broadcastNotification(assignment.instructor.userId, instructorNotification);
        await socketServer.broadcastNotification(assignment.learner.userId, learnerNotification);

        // Broadcast assignment update to admin rooms
        await socketServer.broadcastToAdmins('assignment-created', {
          assignment,
          instructor: assignment.instructor,
          learner: assignment.learner,
        });

        logger.info(`📡 Real-time notifications sent for assignment: ${assignment.id}`);
      } catch (socketError) {
        logger.warn('Socket notification failed (assignment still created):', socketError);
      }

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: data.assignedBy,
          action: 'CREATE',
          entity: 'ASSIGNMENT',
          entityId: assignment.id,
          newValues: JSON.stringify({
            learnerId: data.learnerId,
            instructorId: data.instructorId,
            priority: data.priority,
          }),
        },
      });

      logger.info(`Student assigned: ${learnerName} to ${instructorName}`);

      return {
        success: true,
        data: assignment,
        message: 'Student assigned successfully',
      };
    } catch (error) {
      logger.error('Assign student to instructor error:', error);
      throw error;
    }
  }

  static async getInstructorAssignments(
    instructorId: string,
    status?: AssignmentStatus
  ): Promise<any[]> {
    try {
      const whereClause: any = {
        instructorId,
      };

      if (status) {
        whereClause.status = status;
      }

      const assignments = await db.assignment.findMany({
        where: whereClause,
        include: {
          learner: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          lessons: {
            orderBy: {
              scheduledAt: 'desc',
            },
            take: 5,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return assignments;
    } catch (error) {
      logger.error('Get instructor assignments error:', error);
      throw error;
    }
  }

  static async unassignStudent(assignmentId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const assignment = await db.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          learner: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Update assignment status
      const updatedAssignment = await db.assignment.update({
        where: { id: assignmentId },
        data: {
          status: AssignmentStatus.CANCELLED,
          endDate: new Date(),
        },
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          learner: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      // Update instructor active students count
      await db.instructorProfile.update({
        where: { id: assignment.instructorId },
        data: {
          activeStudents: {
            decrement: 1,
          },
        },
      });

      // Create real-time notifications for assignment removal
      const instructorNotification = await db.notification.create({
        data: {
          userId: assignment.instructor.userId,
          title: 'Assignment Removed',
          message: `Student assignment removed: ${assignment.learner.user.firstName} ${assignment.learner.user.lastName}`,
          type: 'ASSIGNMENT',
          metadata: JSON.stringify({
            assignmentId,
            studentName: `${assignment.learner.user.firstName} ${assignment.learner.user.lastName}`,
            action: 'removed',
          }),
          actionUrl: '/dashboard/assignments',
        },
      });

      const learnerNotification = await db.notification.create({
        data: {
          userId: assignment.learner.userId,
          title: 'Assignment Removed',
          message: `Your assignment to instructor ${assignment.instructor.user.firstName} ${assignment.instructor.user.lastName} has been removed`,
          type: 'ASSIGNMENT',
          metadata: JSON.stringify({
            assignmentId,
            instructorName: `${assignment.instructor.user.firstName} ${assignment.instructor.user.lastName}`,
            action: 'removed',
          }),
          actionUrl: '/dashboard/lessons',
        },
      });

      // Send real-time notifications via Socket.IO
      try {
        const socketServer = getSocketServer();
        
        // Broadcast assignment update to assignment room
        await socketServer.broadcastAssignmentUpdate(assignmentId, updatedAssignment, 'assignment-cancelled');
        
        // Broadcast notifications
        await socketServer.broadcastNotification(assignment.instructor.userId, instructorNotification);
        await socketServer.broadcastNotification(assignment.learner.userId, learnerNotification);

        // Broadcast to admin rooms
        await socketServer.broadcastToAdmins('assignment-removed', {
          assignmentId,
          instructor: assignment.instructor,
          learner: assignment.learner,
        });

        logger.info(`📡 Real-time notifications sent for assignment removal: ${assignmentId}`);
      } catch (socketError) {
        logger.warn('Socket notification failed (assignment still unassigned):', socketError);
      }

      // Create audit log
      await db.auditLog.create({
        data: {
          userId,
          action: 'UPDATE',
          entity: 'ASSIGNMENT',
          entityId: assignmentId,
          newValues: JSON.stringify({
            status: AssignmentStatus.CANCELLED,
            endDate: new Date(),
          }),
        },
      });

      logger.info(`Assignment unassigned: ${assignmentId}`);
      
      return {
        success: true,
        message: 'Student unassigned successfully',
      };
    } catch (error) {
      logger.error('Unassign student error:', error);
      throw error;
    }
  }

  static async getAvailableInstructors(): Promise<InstructorWithStats[]> {
    try {
      const instructors = await db.instructorProfile.findMany({
        where: {
          isActive: true,
          user: {
            status: 'ACTIVE',
            role: UserRole.INSTRUCTOR,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
        orderBy: [
          { activeStudents: 'asc' }, // Instructors with fewer active students first
          { rating: 'desc' }, // Then by rating
        ],
      });

      return instructors.map(instructor => ({
        ...instructor,
        specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
        availability: instructor.availabilityNotes ? JSON.parse(instructor.availabilityNotes) : {},
      }));
    } catch (error) {
      logger.error('Get available instructors error:', error);
      throw error;
    }
  }

  static async updateInstructorAvailability(
    instructorId: string,
    availability: Record<string, unknown>
  ): Promise<void> {
    try {
      await db.instructorProfile.update({
        where: { id: instructorId },
        data: {
          availabilityNotes: JSON.stringify(availability),
          updatedAt: new Date(),
        },
      });

      logger.info(`Instructor availability updated: ${instructorId}`);
    } catch (error) {
      logger.error('Update instructor availability error:', error);
      throw error;
    }
  }
}