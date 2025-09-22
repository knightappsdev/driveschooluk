import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', AuthController.loginValidation, AuthController.login);

/**
 * @route   POST /api/auth/register
 * @desc    User registration
 * @access  Public
 */
router.post('/register', AuthController.registerValidation, AuthController.register);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', AuthController.passwordResetValidation, AuthController.requestPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', AuthController.resetPasswordValidation, AuthController.resetPassword);

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify-email', AuthController.verifyEmail);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Private
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

export default router;