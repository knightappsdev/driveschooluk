import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/jwt';
import { db } from '../utils/database';
import { logger } from '../utils/logger';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    status: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7);
    const payload = JWTService.verifyAccessToken(token);

    // Verify user still exists and is active
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (user.status === 'SUSPENDED' || user.status === 'INACTIVE') {
      res.status(403).json({
        success: false,
        message: 'Account is suspended or inactive'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const requireSuperAdmin = authorize([UserRole.SUPER_ADMIN]);
export const requireAdmin = authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
export const requireInstructor = authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.INSTRUCTOR]);
export const requireAnyRole = authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.LEARNER]);