import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { notificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Create a new lesson booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      learnerId, 
      instructorId, 
      lessonType, 
      scheduledAt, 
      duration, 
      location, 
      notes 
    } = req.body;

    // Validate required fields
    if (!learnerId || !instructorId || !scheduledAt) {
      res.status(400).json({ error: 'Learner ID, Instructor ID, and scheduled time are required' });
      return;
    }

    // Check if instructor is available at the requested time
    const existingBooking = await prisma.lessonBooking.findFirst({
      where: {
        instructorId,
        scheduledAt: new Date(scheduledAt),
        status: { in: ['CONFIRMED', 'PENDING'] }
      }
    });

    if (existingBooking) {
      res.status(400).json({ error: 'Instructor is not available at the requested time' });
      return;
    }

    // Create the booking
    const booking = await prisma.lessonBooking.create({
      data: {
        learnerId,
        instructorId,
        lessonType: lessonType || 'PRACTICAL',
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60, // Default 1 hour
        location,
        notes,
        status: 'CONFIRMED'
      },
      include: {
        learner: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        instructor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    // Send booking confirmation notifications
    try {
      await notificationService.sendBookingConfirmation(booking.id);
      logger.info(`Booking confirmation notifications sent for booking: ${booking.id}`);
    } catch (notificationError) {
      logger.error('Failed to send booking confirmation notifications:', notificationError);
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get all bookings (with filters)
export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      instructorId, 
      learnerId, 
      status, 
      dateFrom, 
      dateTo,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (instructorId) {
      where.instructorId = instructorId as string;
    }
    
    if (learnerId) {
      where.learnerId = learnerId as string;
    }
    
    if (status) {
      where.status = status as string;
    }
    
    if (dateFrom || dateTo) {
      where.scheduledAt = {};
      if (dateFrom) {
        where.scheduledAt.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        where.scheduledAt.lte = new Date(dateTo as string);
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.lessonBooking.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { scheduledAt: 'asc' },
        include: {
          learner: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        }
      }),
      prisma.lessonBooking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Booking ID is required' });
      return;
    }

    const booking = await prisma.lessonBooking.findUnique({
      where: { id },
      include: {
        learner: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        instructor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(booking);

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Booking ID is required' });
      return;
    }

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const updatedBooking = await prisma.lessonBooking.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined
      },
      include: {
        learner: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        instructor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Reschedule booking
export const rescheduleBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newScheduledAt, notes } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Booking ID is required' });
      return;
    }

    if (!newScheduledAt) {
      res.status(400).json({ error: 'New scheduled time is required' });
      return;
    }

    // Get the booking to check instructor
    const existingBooking = await prisma.lessonBooking.findUnique({
      where: { id }
    });

    if (!existingBooking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Check if instructor is available at the new time
    const conflictingBooking = await prisma.lessonBooking.findFirst({
      where: {
        instructorId: existingBooking.instructorId,
        scheduledAt: new Date(newScheduledAt),
        status: { in: ['CONFIRMED', 'PENDING'] },
        id: { not: id } // Exclude current booking
      }
    });

    if (conflictingBooking) {
      res.status(400).json({ error: 'Instructor is not available at the new requested time' });
      return;
    }

    const updatedBooking = await prisma.lessonBooking.update({
      where: { id },
      data: {
        scheduledAt: new Date(newScheduledAt),
        notes: notes || existingBooking.notes,
        status: 'CONFIRMED'
      },
      include: {
        learner: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        instructor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Booking rescheduled successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ error: 'Failed to reschedule booking' });
  }
};

// Get instructor availability for a date range
export const getInstructorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;
    const { dateFrom, dateTo } = req.query;

    if (!instructorId) {
      res.status(400).json({ error: 'Instructor ID is required' });
      return;
    }

    if (!dateFrom || !dateTo) {
      res.status(400).json({ error: 'Date range is required' });
      return;
    }

    const existingBookings = await prisma.lessonBooking.findMany({
      where: {
        instructorId,
        scheduledAt: {
          gte: new Date(dateFrom as string),
          lte: new Date(dateTo as string)
        },
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
      },
      select: {
        scheduledAt: true,
        duration: true
      },
      orderBy: { scheduledAt: 'asc' }
    });

    res.json({
      instructorId,
      dateRange: { from: dateFrom, to: dateTo },
      bookedSlots: existingBookings
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};