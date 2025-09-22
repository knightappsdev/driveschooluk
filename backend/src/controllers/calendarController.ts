import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get instructor calendar view (bookings + availability)
export const getInstructorCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;
    const { startDate, endDate } = req.query;

    if (!instructorId) {
      res.status(400).json({ error: 'Instructor ID is required' });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }

    // Get bookings for the date range
    const bookings = await prisma.lessonBooking.findMany({
      where: {
        instructorId,
        scheduledAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
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
        }
      },
      orderBy: { scheduledAt: 'asc' }
    });

    // Get availability slots
    const availability = await prisma.instructorAvailability.findMany({
      where: {
        instructorId,
        isActive: true
      },
      orderBy: { dayOfWeek: 'asc' }
    });

    // Transform bookings into calendar events
    const calendarEvents = bookings.map(booking => ({
      id: booking.id,
      type: 'booking',
      title: `Lesson - ${booking.learner.user.firstName} ${booking.learner.user.lastName}`,
      start: booking.scheduledAt,
      end: new Date(booking.scheduledAt.getTime() + (booking.duration * 60000)),
      status: booking.status,
      lessonType: booking.lessonType,
      location: booking.location,
      notes: booking.notes,
      student: {
        id: booking.learner.id,
        name: `${booking.learner.user.firstName} ${booking.learner.user.lastName}`,
        email: booking.learner.user.email,
        phone: booking.learner.user.phone
      },
      editable: booking.status === 'PENDING' || booking.status === 'CONFIRMED'
    }));

    // Transform availability into calendar events (generate for date range)
    const availabilityEvents: any[] = [];
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      
      // Find matching availability for this day
      const dayAvailability = availability.filter(slot => 
        (slot.isRecurring && slot.dayOfWeek === dayOfWeek) ||
        (slot.specificDate && slot.specificDate.toDateString() === date.toDateString())
      );
      
      dayAvailability.forEach(slot => {
        const startDateTime = new Date(`${date.toISOString().split('T')[0]}T${slot.startTime}:00`);
        const endDateTime = new Date(`${date.toISOString().split('T')[0]}T${slot.endTime}:00`);
        
        availabilityEvents.push({
          id: `avail_${slot.id}_${date.toISOString().split('T')[0]}`,
          type: 'availability',
          title: 'Available',
          start: startDateTime,
          end: endDateTime,
          available: true,
          dayOfWeek: slot.dayOfWeek,
          recurring: slot.isRecurring,
          editable: true
        });
      });
    }

    res.json({
      instructorId,
      dateRange: { start: startDate, end: endDate },
      events: [...calendarEvents, ...availabilityEvents],
      summary: {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        totalAvailableSlots: availabilityEvents.length,
        totalUnavailableSlots: 0
      }
    });

  } catch (error) {
    console.error('Error fetching instructor calendar:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
};

// Set instructor availability (using correct schema)
export const setInstructorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;
    const { dayOfWeek, startTime, endTime, isRecurring, specificDate } = req.body;

    if (!instructorId || (!dayOfWeek && !specificDate) || !startTime || !endTime) {
      res.status(400).json({ error: 'Instructor ID, day/date, start time, and end time are required' });
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      res.status(400).json({ error: 'Time must be in HH:MM format' });
      return;
    }

    // Create the availability slot
    const availability = await prisma.instructorAvailability.create({
      data: {
        instructorId,
        dayOfWeek: dayOfWeek || new Date(specificDate).getDay(),
        startTime,
        endTime,
        isRecurring: isRecurring !== false,
        specificDate: specificDate ? new Date(specificDate) : null,
        isActive: true
      }
    });

    res.status(201).json({
      message: 'Availability set successfully',
      availability
    });

  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ error: 'Failed to set availability' });
  }
};

// Update availability slot
export const updateInstructorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { availabilityId } = req.params;
    const { startTime, endTime, isActive } = req.body;

    if (!availabilityId) {
      res.status(400).json({ error: 'Availability ID is required' });
      return;
    }

    // Validate time format if provided
    if (startTime || endTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (startTime && !timeRegex.test(startTime)) {
        res.status(400).json({ error: 'Start time must be in HH:MM format' });
        return;
      }
      if (endTime && !timeRegex.test(endTime)) {
        res.status(400).json({ error: 'End time must be in HH:MM format' });
        return;
      }
    }

    const updatedAvailability = await prisma.instructorAvailability.update({
      where: { id: availabilityId },
      data: {
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    res.json({
      message: 'Availability updated successfully',
      availability: updatedAvailability
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

// Delete availability slot
export const deleteInstructorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { availabilityId } = req.params;

    if (!availabilityId) {
      res.status(400).json({ error: 'Availability ID is required' });
      return;
    }

    // Soft delete by setting isActive to false
    const updatedAvailability = await prisma.instructorAvailability.update({
      where: { id: availabilityId },
      data: { isActive: false }
    });

    res.json({
      message: 'Availability deleted successfully',
      availability: updatedAvailability
    });

  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
};

// Get instructor's weekly schedule template
export const getWeeklyScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;

    if (!instructorId) {
      res.status(400).json({ error: 'Instructor ID is required' });
      return;
    }

    // Get all active recurring availability
    const availability = await prisma.instructorAvailability.findMany({
      where: {
        instructorId,
        isActive: true,
        isRecurring: true
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });

    // Process into weekly template
    const template: Record<number, any[]> = {
      0: [], // Sunday
      1: [], // Monday
      2: [], // Tuesday
      3: [], // Wednesday
      4: [], // Thursday
      5: [], // Friday
      6: []  // Saturday
    };

    availability.forEach(slot => {
      const daySlots = template[slot.dayOfWeek];
      if (daySlots) {
        daySlots.push({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isRecurring: slot.isRecurring
        });
      }
    });

    res.json({
      instructorId,
      weeklyTemplate: template,
      totalSlots: availability.length
    });

  } catch (error) {
    console.error('Error fetching weekly template:', error);
    res.status(500).json({ error: 'Failed to fetch weekly schedule template' });
  }
};

// Bulk set availability for multiple days
export const bulkSetAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;
    const { weeklySchedule, overwriteExisting } = req.body;

    if (!instructorId || !weeklySchedule) {
      res.status(400).json({ error: 'Instructor ID and weekly schedule are required' });
      return;
    }

    // Validate time format for all slots
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (const [dayOfWeek, daySlots] of Object.entries(weeklySchedule)) {
      if (Array.isArray(daySlots)) {
        for (const slot of daySlots as any[]) {
          if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
            res.status(400).json({ error: `Invalid time format in day ${dayOfWeek}` });
            return;
          }
        }
      }
    }

    // If overwriting existing, deactivate current recurring availability
    if (overwriteExisting) {
      await prisma.instructorAvailability.updateMany({
        where: {
          instructorId,
          isRecurring: true,
          isActive: true
        },
        data: { isActive: false }
      });
    }

    const availabilitySlots: any[] = [];

    // Generate availability slots for each day
    for (const [dayOfWeekStr, daySlots] of Object.entries(weeklySchedule)) {
      const dayOfWeek = parseInt(dayOfWeekStr);
      if (Array.isArray(daySlots) && daySlots.length > 0) {
        daySlots.forEach((slot: any) => {
          availabilitySlots.push({
            instructorId,
            dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isRecurring: true,
            specificDate: null,
            isActive: true
          });
        });
      }
    }

    // Create new availability slots
    const result = await prisma.instructorAvailability.createMany({
      data: availabilitySlots
    });

    res.json({
      message: 'Bulk availability set successfully',
      createdSlots: result.count,
      weeklySchedule
    });

  } catch (error) {
    console.error('Error setting bulk availability:', error);
    res.status(500).json({ error: 'Failed to set bulk availability' });
  }
};

// Get available time slots for booking
export const getAvailableTimeSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;
    const { date, duration } = req.query;

    if (!instructorId || !date) {
      res.status(400).json({ error: 'Instructor ID and date are required' });
      return;
    }

    const targetDate = new Date(date as string);
    const dayOfWeek = targetDate.getDay();
    const lessonDuration = parseInt(duration as string) || 60; // Default 60 minutes

    // Get availability for this day
    const availability = await prisma.instructorAvailability.findMany({
      where: {
        instructorId,
        isActive: true,
        OR: [
          {
            isRecurring: true,
            dayOfWeek: dayOfWeek
          },
          {
            specificDate: targetDate
          }
        ]
      }
    });

    // Get existing bookings for this date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.lessonBooking.findMany({
      where: {
        instructorId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    // Calculate available time slots
    const availableSlots: any[] = [];

    availability.forEach(slot => {
      const startTimeParts = slot.startTime.split(':');
      const endTimeParts = slot.endTime.split(':');
      
      if (startTimeParts.length < 2 || endTimeParts.length < 2 || !startTimeParts[0] || !startTimeParts[1] || !endTimeParts[0] || !endTimeParts[1]) {
        return; // Skip invalid time format
      }
      
      const slotStart = new Date(targetDate);
      slotStart.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]), 0, 0);
      
      const slotEnd = new Date(targetDate);
      slotEnd.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);

      // Generate time slots within this availability window
      for (let time = new Date(slotStart); time < slotEnd; time.setMinutes(time.getMinutes() + lessonDuration)) {
        const slotEndTime = new Date(time.getTime() + lessonDuration * 60000);
        
        if (slotEndTime <= slotEnd) {
          // Check if this slot conflicts with existing bookings
          const hasConflict = existingBookings.some(booking => {
            const bookingStart = booking.scheduledAt;
            const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
            
            return (time < bookingEnd && slotEndTime > bookingStart);
          });

          if (!hasConflict) {
            availableSlots.push({
              startTime: time.toISOString(),
              endTime: slotEndTime.toISOString(),
              duration: lessonDuration
            });
          }
        }
      }
    });

    res.json({
      instructorId,
      date: targetDate.toISOString().split('T')[0],
      requestedDuration: lessonDuration,
      availableSlots: availableSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      totalSlots: availableSlots.length
    });

  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
};