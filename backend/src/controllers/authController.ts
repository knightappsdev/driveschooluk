import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';
import { body, validationResult } from 'express-validator';

export class AuthController {
  static loginValidation = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];

  static registerValidation = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
    body('firstName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters'),
    body('phone')
      .optional()
      .isMobilePhone('en-GB')
      .withMessage('Please provide a valid UK phone number'),
    body('role')
      .optional()
      .isIn(['LEARNER', 'INSTRUCTOR'])
      .withMessage('Role must be either LEARNER or INSTRUCTOR'),
  ];

  static passwordResetValidation = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
  ];

  static resetPasswordValidation = [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
  ];

  static async login(req: Request, res: Response): Promise<void> {
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

      const authData = await AuthService.login(req.body);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: authData,
      });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
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

      const authData = await AuthService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: authData,
      });
    } catch (error) {
      logger.error('Registration controller error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const authData = await AuthService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: authData,
      });
    } catch (error) {
      logger.error('Refresh token controller error:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token refresh failed',
      });
    }
  }

  static async requestPasswordReset(req: Request, res: Response): Promise<void> {
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

      await AuthService.requestPasswordReset(req.body);
      
      res.status(200).json({
        success: true,
        message: 'If an account with this email exists, you will receive password reset instructions.',
      });
    } catch (error) {
      logger.error('Password reset request controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
      });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
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

      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.',
      });
    } catch (error) {
      logger.error('Password reset controller error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Password reset failed',
      });
    }
  }

  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Verification token is required',
        });
        return;
      }

      await AuthService.verifyEmail(token);
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully. Your account is now active.',
      });
    } catch (error) {
      logger.error('Email verification controller error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Email verification failed',
      });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success response
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Profile information is already available in req.user from middleware
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: req.user,
      });
    } catch (error) {
      logger.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
      });
    }
  }
}