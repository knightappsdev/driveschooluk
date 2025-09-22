// Instructor Model - DriveConnect UK
// Handles all instructor-related database operations

const { executeQuery, executeTransaction } = require('../config/database');

class Instructor {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.adiNumber = data.adi_number;
    this.yearsExperience = data.years_experience;
    this.hourlyRate = data.hourly_rate;
    this.transmissionType = data.transmission_type;
    this.specialty = data.specialty;
    this.bio = data.bio;
    this.ratingAverage = data.rating_average;
    this.totalReviews = data.total_reviews;
    this.passRate = data.pass_rate;
    this.isApproved = data.is_approved;
    this.createdAt = data.created_at;
  }

  // Create instructor profile
  static async create(instructorData) {
    try {
      const query = `
        INSERT INTO instructor_profiles (
          user_id, adi_number, adi_expiry_date, driving_license_number, 
          driving_license_expiry, years_experience, hourly_rate, transmission_type,
          specialty, bio, languages_spoken, nationality, religion, ethnicity,
          insurance_provider, insurance_expiry_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        instructorData.userId,
        instructorData.adiNumber,
        instructorData.adiExpiryDate,
        instructorData.drivingLicenseNumber,
        instructorData.drivingLicenseExpiry,
        instructorData.yearsExperience,
        instructorData.hourlyRate,
        instructorData.transmissionType,
        instructorData.specialty || null,
        instructorData.bio || null,
        instructorData.languagesSpoken || null,
        instructorData.nationality || null,
        instructorData.religion || null,
        instructorData.ethnicity || null,
        instructorData.insuranceProvider,
        instructorData.insuranceExpiryDate
      ];
      
      const result = await executeQuery(query, params);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating instructor profile: ${error.message}`);
    }
  }

  // Get all approved instructors with filters
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT 
          u.id, u.first_name, u.last_name, u.email, u.phone, u.gender,
          ip.*, a.city, a.postcode,
          GROUP_CONCAT(DISTINCT isa.city) as service_areas
        FROM users u
        JOIN instructor_profiles ip ON u.id = ip.user_id
        LEFT JOIN addresses a ON u.id = a.user_id AND a.is_primary = TRUE
        LEFT JOIN instructor_service_areas isa ON ip.id = isa.instructor_id
        WHERE u.user_type = 'instructor' AND u.is_active = TRUE AND ip.is_approved = TRUE
      `;
      
      const params = [];
      
      // Apply filters
      if (filters.city) {
        query += ` AND (a.city LIKE ? OR isa.city LIKE ?)`;
        params.push(`%${filters.city}%`, `%${filters.city}%`);
      }
      
      if (filters.transmission) {
        query += ` AND (ip.transmission_type = ? OR ip.transmission_type = 'both')`;
        params.push(filters.transmission);
      }
      
      if (filters.gender) {
        query += ` AND u.gender = ?`;
        params.push(filters.gender);
      }
      
      if (filters.nationality) {
        query += ` AND ip.nationality = ?`;
        params.push(filters.nationality);
      }
      
      if (filters.religion) {
        query += ` AND ip.religion = ?`;
        params.push(filters.religion);
      }
      
      if (filters.ethnicity) {
        query += ` AND ip.ethnicity = ?`;
        params.push(filters.ethnicity);
      }
      
      if (filters.minRating) {
        query += ` AND ip.rating_average >= ?`;
        params.push(filters.minRating);
      }
      
      if (filters.maxRate) {
        query += ` AND ip.hourly_rate <= ?`;
        params.push(filters.maxRate);
      }
      
      query += ` GROUP BY u.id`;
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'rating':
            query += ` ORDER BY ip.rating_average DESC`;
            break;
          case 'price_low':
            query += ` ORDER BY ip.hourly_rate ASC`;
            break;
          case 'price_high':
            query += ` ORDER BY ip.hourly_rate DESC`;
            break;
          case 'experience':
            query += ` ORDER BY ip.years_experience DESC`;
            break;
          default:
            query += ` ORDER BY ip.rating_average DESC`;
        }
      } else {
        query += ` ORDER BY ip.rating_average DESC`;
      }
      
      // Apply pagination
      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(filters.limit));
        
        if (filters.offset) {
          query += ` OFFSET ?`;
          params.push(parseInt(filters.offset));
        }
      }
      
      const results = await executeQuery(query, params);
      return results;
    } catch (error) {
      throw new Error(`Error getting instructors: ${error.message}`);
    }
  }

  // Get instructor by ID with full details
  static async getById(instructorId) {
    try {
      const query = `
        SELECT 
          u.*, ip.*, a.*,
          GROUP_CONCAT(DISTINCT isa.city) as service_areas,
          GROUP_CONCAT(DISTINCT CONCAT(iv.make, ' ', iv.model, ' (', iv.transmission, ')')) as vehicles
        FROM users u
        JOIN instructor_profiles ip ON u.id = ip.user_id
        LEFT JOIN addresses a ON u.id = a.user_id AND a.is_primary = TRUE
        LEFT JOIN instructor_service_areas isa ON ip.id = isa.instructor_id
        LEFT JOIN instructor_vehicles iv ON ip.id = iv.instructor_id
        WHERE ip.id = ? AND u.is_active = TRUE
        GROUP BY u.id
      `;
      
      const results = await executeQuery(query, [instructorId]);
      
      if (results.length === 0) {
        return null;
      }
      
      return results[0];
    } catch (error) {
      throw new Error(`Error getting instructor by ID: ${error.message}`);
    }
  }

  // Get instructor availability
  static async getAvailability(instructorId, date = null) {
    try {
      let query = `
        SELECT * FROM instructor_availability 
        WHERE instructor_id = ? AND is_available = TRUE
      `;
      
      const params = [instructorId];
      
      if (date) {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        query += ` AND day_of_week = ?`;
        params.push(dayOfWeek);
      }
      
      query += ` ORDER BY FIELD(day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'), start_time`;
      
      const results = await executeQuery(query, params);
      return results;
    } catch (error) {
      throw new Error(`Error getting instructor availability: ${error.message}`);
    }
  }

  // Update instructor profile
  static async updateProfile(instructorId, updateData) {
    try {
      const allowedFields = [
        'years_experience', 'hourly_rate', 'transmission_type', 'specialty',
        'bio', 'languages_spoken', 'nationality', 'religion', 'ethnicity'
      ];
      
      const updates = [];
      const params = [];
      
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          updates.push(`${key} = ?`);
          params.push(updateData[key]);
        }
      });
      
      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      params.push(instructorId);
      
      const query = `
        UPDATE instructor_profiles 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating instructor profile: ${error.message}`);
    }
  }

  // Add vehicle
  static async addVehicle(instructorId, vehicleData) {
    try {
      const query = `
        INSERT INTO instructor_vehicles (
          instructor_id, make, model, year, registration, transmission,
          fuel_type, color, is_dual_control, mot_expiry, insurance_expiry
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        instructorId,
        vehicleData.make,
        vehicleData.model,
        vehicleData.year,
        vehicleData.registration,
        vehicleData.transmission,
        vehicleData.fuelType,
        vehicleData.color || null,
        vehicleData.isDualControl || true,
        vehicleData.motExpiry || null,
        vehicleData.insuranceExpiry || null
      ];
      
      const result = await executeQuery(query, params);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error adding vehicle: ${error.message}`);
    }
  }

  // Set availability
  static async setAvailability(instructorId, availabilityData) {
    try {
      // First, clear existing availability
      await executeQuery('DELETE FROM instructor_availability WHERE instructor_id = ?', [instructorId]);
      
      // Insert new availability
      const queries = availabilityData.map(slot => ({
        query: `
          INSERT INTO instructor_availability (instructor_id, day_of_week, start_time, end_time, is_available)
          VALUES (?, ?, ?, ?, ?)
        `,
        params: [instructorId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.isAvailable || true]
      }));
      
      await executeTransaction(queries);
      return true;
    } catch (error) {
      throw new Error(`Error setting availability: ${error.message}`);
    }
  }

  // Get instructor statistics
  static async getStatistics(instructorId) {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT b.id) as total_bookings,
          COUNT(DISTINCT CASE WHEN b.booking_status = 'completed' THEN b.id END) as completed_bookings,
          COUNT(DISTINCT l.id) as total_lessons,
          COUNT(DISTINCT CASE WHEN l.lesson_status = 'completed' THEN l.id END) as completed_lessons,
          AVG(r.rating) as average_rating,
          COUNT(DISTINCT r.id) as total_reviews,
          SUM(p.amount) as total_earnings
        FROM instructor_profiles ip
        LEFT JOIN bookings b ON ip.id = b.instructor_id
        LEFT JOIN lessons l ON b.id = l.booking_id
        LEFT JOIN reviews r ON b.id = r.booking_id AND r.reviewee_id = ip.user_id
        LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'completed'
        WHERE ip.id = ?
        GROUP BY ip.id
      `;
      
      const results = await executeQuery(query, [instructorId]);
      return results[0] || {};
    } catch (error) {
      throw new Error(`Error getting instructor statistics: ${error.message}`);
    }
  }

  // Approve instructor
  static async approve(instructorId, approvedBy) {
    try {
      const query = `
        UPDATE instructor_profiles 
        SET is_approved = TRUE, approval_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, [instructorId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error approving instructor: ${error.message}`);
    }
  }
}

module.exports = Instructor;
