import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@prisma/client';
import { db } from '../utils/database';
import { JWTService } from '../utils/jwt';
import { logger } from '../utils/logger';
import { AuthRequest, RegisterRequest, AuthResponse, PasswordResetRequest } from '../types/auth';
import { emailService } from './emailService';
import crypto from 'crypto';

export class AuthService {
  static async login(data: AuthRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await db.user.findUnique({
        where: { email: data.email.toLowerCase() },
        include: {
          learnerProfile: true,
          instructorProfile: true,
        },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Check user status
      if (user.status === UserStatus.SUSPENDED) {
        throw new Error('Account is suspended. Please contact support.');
      }

      if (user.status === UserStatus.INACTIVE) {
        throw new Error('Account is inactive. Please contact support.');
      }

      // Update last login
      await db.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = JWTService.generateAccessToken(tokenPayload);
      const refreshToken = JWTService.generateRefreshToken(tokenPayload);
      const expiresIn = JWTService.getTokenExpirationTime();

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          entity: 'USER',
          entityId: user.id,
          ipAddress: 'unknown', // Will be set by controller
        },
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          ...(user.profileImage && { profileImage: user.profileImage }),
        },
        accessToken,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, parseInt(process.env['BCRYPT_ROUNDS'] || '12'));

      // Create user
      const user = await db.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
          role: data.role || UserRole.LEARNER,
          status: UserStatus.PENDING_VERIFICATION,
        },
      });

      // Create profile based on role
      if (user.role === UserRole.LEARNER) {
        await db.learnerProfile.create({
          data: {
            userId: user.id,
            startDate: new Date(),
          },
        });
      } else if (user.role === UserRole.INSTRUCTOR) {
        await db.instructorProfile.create({
          data: {
            userId: user.id,
            instructorLicense: `INST-${Date.now()}-${user.id.slice(-4).toUpperCase()}`,
            isActive: false, // Requires admin approval
          },
        });
      }

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = JWTService.generateAccessToken(tokenPayload);
      const refreshToken = JWTService.generateRefreshToken(tokenPayload);
      const expiresIn = JWTService.getTokenExpirationTime();

      // Send verification email (async)
      this.sendVerificationEmail(user.email, user.firstName).catch(error => {
        logger.error('Failed to send verification email:', error);
      });

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'REGISTER',
          entity: 'USER',
          entityId: user.id,
        },
      });

      logger.info(`New user registered: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        accessToken,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = JWTService.verifyRefreshToken(refreshToken);
      
      const user = await db.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
        throw new Error('Invalid user or account status');
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = JWTService.generateAccessToken(tokenPayload);
      const newRefreshToken = JWTService.generateRefreshToken(tokenPayload);
      const expiresIn = JWTService.getTokenExpirationTime();

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          ...(user.profileImage && { profileImage: user.profileImage }),
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn,
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      const user = await db.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (!user) {
        // Don't reveal if email exists or not for security
        logger.info(`Password reset requested for non-existent email: ${data.email}`);
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
        },
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

      logger.info(`Password reset requested for: ${user.email}`);
    } catch (error) {
      logger.error('Password reset request error:', error);
      throw error;
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await db.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env['BCRYPT_ROUNDS'] || '12'));

      await db.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      // Create audit log
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_RESET',
          entity: 'USER',
          entityId: user.id,
        },
      });

      logger.info(`Password reset completed for: ${user.email}`);
    } catch (error) {
      logger.error('Password reset error:', error);
      throw error;
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      // In a real app, you'd store verification tokens in the database
      // For this demo, we'll just mark all unverified users as verified
      const payload = JWTService.verifyAccessToken(token);
      
      await db.user.update({
        where: { id: payload.userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: UserStatus.ACTIVE,
        },
      });

      logger.info(`Email verified for user: ${payload.userId}`);
    } catch (error) {
      logger.error('Email verification error:', error);
      throw new Error('Invalid verification token');
    }
  }

  private static async sendVerificationEmail(email: string, firstName: string): Promise<void> {
    try {
      // Generate verification token (in real app, store this in DB)
      const verificationToken = JWTService.generateAccessToken({
        userId: email, // Using email as temp identifier
        email,
        role: UserRole.LEARNER,
      });

      await emailService.sendVerificationEmail(email, firstName, verificationToken);
    } catch (error) {
      logger.error('Send verification email error:', error);
    }
  }
}