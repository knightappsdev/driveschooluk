// User Model - DriveConnect UK
// Handles all user-related database operations

const { executeQuery, executeTransaction } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.userType = data.user_type;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.phone = data.phone;
    this.dateOfBirth = data.date_of_birth;
    this.gender = data.gender;
    this.profileImage = data.profile_image;
    this.isActive = data.is_active;
    this.emailVerified = data.email_verified;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create new user
  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const query = `
        INSERT INTO users (
          email, password_hash, user_type, first_name, last_name, 
          phone, date_of_birth, gender, profile_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        userData.email,
        hashedPassword,
        userData.userType,
        userData.firstName,
        userData.lastName,
        userData.phone || null,
        userData.dateOfBirth || null,
        userData.gender || null,
        userData.profileImage || null
      ];
      
      const result = await executeQuery(query, params);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
      const results = await executeQuery(query, [email]);
      
      if (results.length === 0) {
        return null;
      }
      
      return new User(results[0]);
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
      const results = await executeQuery(query, [id]);
      
      if (results.length === 0) {
        return null;
      }
      
      return new User(results[0]);
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = [
        'first_name', 'last_name', 'phone', 'date_of_birth', 
        'gender', 'profile_image'
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
      
      params.push(userId);
      
      const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }

  // Change password
  static async changePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      const query = `
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, [hashedPassword, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }

  // Verify email
  static async verifyEmail(userId) {
    try {
      const query = `
        UPDATE users 
        SET email_verified = TRUE, email_verification_token = NULL, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error verifying email: ${error.message}`);
    }
  }

  // Set password reset token
  static async setPasswordResetToken(email, token, expiresAt) {
    try {
      const query = `
        UPDATE users 
        SET password_reset_token = ?, password_reset_expires = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE email = ?
      `;
      
      const result = await executeQuery(query, [token, expiresAt, email]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error setting password reset token: ${error.message}`);
    }
  }

  // Get user statistics
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          user_type,
          COUNT(*) as count,
          COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_count,
          COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_count
        FROM users 
        GROUP BY user_type
      `;
      
      const results = await executeQuery(query);
      return results;
    } catch (error) {
      throw new Error(`Error getting user statistics: ${error.message}`);
    }
  }

  // Deactivate user account
  static async deactivateAccount(userId) {
    try {
      const query = `
        UPDATE users 
        SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      const result = await executeQuery(query, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deactivating account: ${error.message}`);
    }
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      await executeQuery(query, [userId]);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
}

module.exports = User;
