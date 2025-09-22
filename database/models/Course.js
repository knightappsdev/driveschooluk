// Course Model - DriveConnect UK
// Handles all course-related database operations

const { executeQuery, executeTransaction } = require('../config/database');

class Course {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.description = data.description;
    this.iconClass = data.icon_class;
    this.minHours = data.min_hours;
    this.maxHours = data.max_hours;
    this.basePrice = data.base_price;
    this.transmissionType = data.transmission_type;
    this.difficultyLevel = data.difficulty_level;
    this.features = JSON.parse(data.features || '[]');
    this.fullFeatures = JSON.parse(data.full_features || '[]');
    this.whyChoose = data.why_choose;
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
  }

  // Get all active courses with statistics
  static async getAll() {
    try {
      const query = `
        SELECT 
          c.*,
          cs.registered_students,
          cs.completed_students,
          cs.pass_rate,
          cs.average_rating,
          cs.total_reviews
        FROM courses c
        LEFT JOIN course_statistics cs ON c.id = cs.course_id
        WHERE c.is_active = TRUE
        ORDER BY c.sort_order ASC, c.id ASC
      `;
      
      const results = await executeQuery(query);
      return results.map(course => ({
        ...new Course(course),
        statistics: {
          registeredStudents: course.registered_students || 0,
          completedStudents: course.completed_students || 0,
          passRate: course.pass_rate || 0,
          averageRating: course.average_rating || 0,
          totalReviews: course.total_reviews || 0
        }
      }));
    } catch (error) {
      throw new Error(`Error getting courses: ${error.message}`);
    }
  }

  // Get course by ID
  static async getById(courseId) {
    try {
      const query = `
        SELECT 
          c.*,
          cs.registered_students,
          cs.completed_students,
          cs.pass_rate,
          cs.average_rating,
          cs.total_reviews
        FROM courses c
        LEFT JOIN course_statistics cs ON c.id = cs.course_id
        WHERE c.id = ? AND c.is_active = TRUE
      `;
      
      const results = await executeQuery(query, [courseId]);
      
      if (results.length === 0) {
        return null;
      }
      
      const course = results[0];
      return {
        ...new Course(course),
        statistics: {
          registeredStudents: course.registered_students || 0,
          completedStudents: course.completed_students || 0,
          passRate: course.pass_rate || 0,
          averageRating: course.average_rating || 0,
          totalReviews: course.total_reviews || 0
        }
      };
    } catch (error) {
      throw new Error(`Error getting course by ID: ${error.message}`);
    }
  }

  // Create new course
  static async create(courseData) {
    try {
      const query = `
        INSERT INTO courses (
          title, subtitle, description, icon_class, min_hours, max_hours,
          base_price, transmission_type, difficulty_level, features,
          full_features, why_choose, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        courseData.title,
        courseData.subtitle || null,
        courseData.description || null,
        courseData.iconClass || null,
        courseData.minHours,
        courseData.maxHours,
        courseData.basePrice,
        courseData.transmissionType,
        courseData.difficultyLevel,
        JSON.stringify(courseData.features || []),
        JSON.stringify(courseData.fullFeatures || []),
        courseData.whyChoose || null,
        courseData.sortOrder || 0
      ];
      
      const result = await executeQuery(query, params);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  // Update course
  static async update(courseId, updateData) {
    try {
      const allowedFields = [
        'title', 'subtitle', 'description', 'icon_class', 'min_hours',
        'max_hours', 'base_price', 'transmission_type', 'difficulty_level',
        'features', 'full_features', 'why_choose', 'sort_order'
      ];
      
      const updates = [];
      const params = [];
      
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          if (key === 'features' || key === 'full_features') {
            updates.push(`${key} = ?`);
            params.push(JSON.stringify(updateData[key]));
          } else {
            updates.push(`${key} = ?`);
            params.push(updateData[key]);
          }
        }
      });
      
      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      params.push(courseId);
      
      const query = `
        UPDATE courses 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  // Get courses by difficulty level
  static async getByDifficulty(difficultyLevel) {
    try {
      const query = `
        SELECT 
          c.*,
          cs.registered_students,
          cs.pass_rate,
          cs.average_rating
        FROM courses c
        LEFT JOIN course_statistics cs ON c.id = cs.course_id
        WHERE c.difficulty_level = ? AND c.is_active = TRUE
        ORDER BY c.sort_order ASC
      `;
      
      const results = await executeQuery(query, [difficultyLevel]);
      return results.map(course => new Course(course));
    } catch (error) {
      throw new Error(`Error getting courses by difficulty: ${error.message}`);
    }
  }

  // Get popular courses
  static async getPopular(limit = 4) {
    try {
      const query = `
        SELECT 
          c.*,
          cs.registered_students,
          cs.pass_rate,
          cs.average_rating,
          cs.total_reviews
        FROM courses c
        LEFT JOIN course_statistics cs ON c.id = cs.course_id
        WHERE c.is_active = TRUE
        ORDER BY cs.registered_students DESC, cs.average_rating DESC
        LIMIT ?
      `;
      
      const results = await executeQuery(query, [limit]);
      return results.map(course => new Course(course));
    } catch (error) {
      throw new Error(`Error getting popular courses: ${error.message}`);
    }
  }

  // Update course statistics
  static async updateStatistics(courseId) {
    try {
      const query = 'CALL UpdateCourseStatistics(?)';
      await executeQuery(query, [courseId]);
      return true;
    } catch (error) {
      throw new Error(`Error updating course statistics: ${error.message}`);
    }
  }

  // Deactivate course
  static async deactivate(courseId) {
    try {
      const query = `
        UPDATE courses 
        SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, [courseId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deactivating course: ${error.message}`);
    }
  }
}

module.exports = Course;
