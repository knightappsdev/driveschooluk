// Booking Model - DriveConnect UK
// Handles all booking-related database operations

const { executeQuery, executeTransaction } = require('../config/database');

class Booking {
  constructor(data) {
    this.id = data.id;
    this.bookingReference = data.booking_reference;
    this.learnerId = data.learner_id;
    this.instructorId = data.instructor_id;
    this.courseId = data.course_id;
    this.transmissionType = data.transmission_type;
    this.totalHours = data.total_hours;
    this.hourlyRate = data.hourly_rate;
    this.totalAmount = data.total_amount;
    this.amountPaid = data.amount_paid;
    this.paymentStatus = data.payment_status;
    this.bookingStatus = data.booking_status;
    this.startDate = data.start_date;
    this.estimatedCompletionDate = data.estimated_completion_date;
    this.actualCompletionDate = data.actual_completion_date;
    this.notes = data.notes;
    this.createdAt = data.created_at;
  }

  // Generate unique booking reference
  static generateBookingReference() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `BK${year}${timestamp}`;
  }

  // Create new booking
  static async create(bookingData) {
    try {
      const bookingReference = this.generateBookingReference();
      
      const query = `
        INSERT INTO bookings (
          booking_reference, learner_id, instructor_id, course_id,
          transmission_type, total_hours, hourly_rate, total_amount,
          start_date, estimated_completion_date, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        bookingReference,
        bookingData.learnerId,
        bookingData.instructorId,
        bookingData.courseId,
        bookingData.transmissionType,
        bookingData.totalHours,
        bookingData.hourlyRate,
        bookingData.totalAmount,
        bookingData.startDate || null,
        bookingData.estimatedCompletionDate || null,
        bookingData.notes || null
      ];
      
      const result = await executeQuery(query, params);
      return {
        id: result.insertId,
        bookingReference: bookingReference
      };
    } catch (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }

  // Get booking by ID with full details
  static async getById(bookingId) {
    try {
      const query = `
        SELECT 
          b.*,
          u1.first_name as learner_first_name, u1.last_name as learner_last_name,
          u1.email as learner_email, u1.phone as learner_phone,
          u2.first_name as instructor_first_name, u2.last_name as instructor_last_name,
          u2.email as instructor_email, u2.phone as instructor_phone,
          c.title as course_title, c.description as course_description,
          COUNT(l.id) as total_lessons,
          COUNT(CASE WHEN l.lesson_status = 'completed' THEN 1 END) as completed_lessons
        FROM bookings b
        JOIN learner_profiles lp ON b.learner_id = lp.id
        JOIN users u1 ON lp.user_id = u1.id
        JOIN instructor_profiles ip ON b.instructor_id = ip.id
        JOIN users u2 ON ip.user_id = u2.id
        JOIN courses c ON b.course_id = c.id
        LEFT JOIN lessons l ON b.id = l.booking_id
        WHERE b.id = ?
        GROUP BY b.id
      `;
      
      const results = await executeQuery(query, [bookingId]);
      
      if (results.length === 0) {
        return null;
      }
      
      return results[0];
    } catch (error) {
      throw new Error(`Error getting booking by ID: ${error.message}`);
    }
  }

  // Get booking by reference
  static async getByReference(bookingReference) {
    try {
      const query = `
        SELECT 
          b.*,
          u1.first_name as learner_first_name, u1.last_name as learner_last_name,
          u2.first_name as instructor_first_name, u2.last_name as instructor_last_name,
          c.title as course_title
        FROM bookings b
        JOIN learner_profiles lp ON b.learner_id = lp.id
        JOIN users u1 ON lp.user_id = u1.id
        JOIN instructor_profiles ip ON b.instructor_id = ip.id
        JOIN users u2 ON ip.user_id = u2.id
        JOIN courses c ON b.course_id = c.id
        WHERE b.booking_reference = ?
      `;
      
      const results = await executeQuery(query, [bookingReference]);
      
      if (results.length === 0) {
        return null;
      }
      
      return results[0];
    } catch (error) {
      throw new Error(`Error getting booking by reference: ${error.message}`);
    }
  }

  // Get bookings by learner
  static async getByLearner(learnerId, status = null) {
    try {
      let query = `
        SELECT 
          b.*,
          u.first_name as instructor_first_name, u.last_name as instructor_last_name,
          c.title as course_title,
          COUNT(l.id) as total_lessons,
          COUNT(CASE WHEN l.lesson_status = 'completed' THEN 1 END) as completed_lessons
        FROM bookings b
        JOIN instructor_profiles ip ON b.instructor_id = ip.id
        JOIN users u ON ip.user_id = u.id
        JOIN courses c ON b.course_id = c.id
        LEFT JOIN lessons l ON b.id = l.booking_id
        WHERE b.learner_id = ?
      `;
      
      const params = [learnerId];
      
      if (status) {
        query += ` AND b.booking_status = ?`;
        params.push(status);
      }
      
      query += ` GROUP BY b.id ORDER BY b.created_at DESC`;
      
      const results = await executeQuery(query, params);
      return results;
    } catch (error) {
      throw new Error(`Error getting bookings by learner: ${error.message}`);
    }
  }

  // Get bookings by instructor
  static async getByInstructor(instructorId, status = null) {
    try {
      let query = `
        SELECT 
          b.*,
          u.first_name as learner_first_name, u.last_name as learner_last_name,
          c.title as course_title,
          COUNT(l.id) as total_lessons,
          COUNT(CASE WHEN l.lesson_status = 'completed' THEN 1 END) as completed_lessons
        FROM bookings b
        JOIN learner_profiles lp ON b.learner_id = lp.id
        JOIN users u ON lp.user_id = u.id
        JOIN courses c ON b.course_id = c.id
        LEFT JOIN lessons l ON b.id = l.booking_id
        WHERE b.instructor_id = ?
      `;
      
      const params = [instructorId];
      
      if (status) {
        query += ` AND b.booking_status = ?`;
        params.push(status);
      }
      
      query += ` GROUP BY b.id ORDER BY b.created_at DESC`;
      
      const results = await executeQuery(query, params);
      return results;
    } catch (error) {
      throw new Error(`Error getting bookings by instructor: ${error.message}`);
    }
  }

  // Update booking status
  static async updateStatus(bookingId, status, notes = null) {
    try {
      let query = `
        UPDATE bookings 
        SET booking_status = ?, updated_at = CURRENT_TIMESTAMP
      `;
      
      const params = [status, bookingId];
      
      if (notes) {
        query += `, notes = ?`;
        params.splice(-1, 0, notes);
      }
      
      if (status === 'completed') {
        query += `, actual_completion_date = CURRENT_DATE`;
      }
      
      query += ` WHERE id = ?`;
      
      const result = await executeQuery(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating booking status: ${error.message}`);
    }
  }

  // Update payment status
  static async updatePaymentStatus(bookingId, paymentStatus, amountPaid = null) {
    try {
      let query = `
        UPDATE bookings 
        SET payment_status = ?, updated_at = CURRENT_TIMESTAMP
      `;
      
      const params = [paymentStatus, bookingId];
      
      if (amountPaid !== null) {
        query += `, amount_paid = ?`;
        params.splice(-1, 0, amountPaid);
      }
      
      query += ` WHERE id = ?`;
      
      const result = await executeQuery(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }

  // Get booking statistics
  static async getStatistics(filters = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_bookings,
          COUNT(CASE WHEN booking_status = 'pending' THEN 1 END) as pending_bookings,
          COUNT(CASE WHEN booking_status = 'confirmed' THEN 1 END) as confirmed_bookings,
          COUNT(CASE WHEN booking_status = 'in_progress' THEN 1 END) as in_progress_bookings,
          COUNT(CASE WHEN booking_status = 'completed' THEN 1 END) as completed_bookings,
          COUNT(CASE WHEN booking_status = 'cancelled' THEN 1 END) as cancelled_bookings,
          SUM(total_amount) as total_revenue,
          SUM(amount_paid) as total_paid,
          AVG(total_amount) as average_booking_value
        FROM bookings
        WHERE 1=1
      `;
      
      const params = [];
      
      if (filters.startDate) {
        query += ` AND created_at >= ?`;
        params.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ` AND created_at <= ?`;
        params.push(filters.endDate);
      }
      
      if (filters.instructorId) {
        query += ` AND instructor_id = ?`;
        params.push(filters.instructorId);
      }
      
      const results = await executeQuery(query, params);
      return results[0];
    } catch (error) {
      throw new Error(`Error getting booking statistics: ${error.message}`);
    }
  }

  // Cancel booking
  static async cancel(bookingId, reason = null) {
    try {
      const queries = [
        {
          query: `
            UPDATE bookings 
            SET booking_status = 'cancelled', notes = CONCAT(COALESCE(notes, ''), '\nCancellation reason: ', ?), updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          params: [reason || 'No reason provided', bookingId]
        },
        {
          query: `
            UPDATE lessons 
            SET lesson_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE booking_id = ? AND lesson_status IN ('scheduled', 'confirmed')
          `,
          params: [bookingId]
        }
      ];
      
      await executeTransaction(queries);
      return true;
    } catch (error) {
      throw new Error(`Error cancelling booking: ${error.message}`);
    }
  }

  // Get upcoming bookings
  static async getUpcoming(limit = 10) {
    try {
      const query = `
        SELECT 
          b.*,
          u1.first_name as learner_first_name, u1.last_name as learner_last_name,
          u2.first_name as instructor_first_name, u2.last_name as instructor_last_name,
          c.title as course_title
        FROM bookings b
        JOIN learner_profiles lp ON b.learner_id = lp.id
        JOIN users u1 ON lp.user_id = u1.id
        JOIN instructor_profiles ip ON b.instructor_id = ip.id
        JOIN users u2 ON ip.user_id = u2.id
        JOIN courses c ON b.course_id = c.id
        WHERE b.booking_status IN ('confirmed', 'in_progress') 
        AND b.start_date >= CURRENT_DATE
        ORDER BY b.start_date ASC
        LIMIT ?
      `;
      
      const results = await executeQuery(query, [limit]);
      return results;
    } catch (error) {
      throw new Error(`Error getting upcoming bookings: ${error.message}`);
    }
  }
}

module.exports = Booking;
