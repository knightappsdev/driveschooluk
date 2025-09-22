import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';
import { logger } from './logger';

const JWT_SECRET = process.env['JWT_SECRET']!;
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET']!;
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env['JWT_REFRESH_EXPIRES_IN'] || '30d';

export class JWTService {
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'driveconnect-uk',
        audience: 'driveconnect-uk-app',
      } as jwt.SignOptions);
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Token generation failed');
    }
  }

  static generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    try {
      return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'driveconnect-uk',
        audience: 'driveconnect-uk-app',
      } as jwt.SignOptions);
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Refresh token generation failed');
    }
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'driveconnect-uk',
        audience: 'driveconnect-uk-app',
      }) as JWTPayload;
    } catch (error) {
      logger.warn('Access token verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'driveconnect-uk',
        audience: 'driveconnect-uk-app',
      }) as JWTPayload;
    } catch (error) {
      logger.warn('Refresh token verification failed:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  static getTokenExpirationTime(): number {
    const match = JWT_EXPIRES_IN.match(/^(\d+)([smhdw]?)$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default to 7 days

    const value = parseInt(match[1] || '7', 10);
    const unit = match[2] || 'd';

    const multipliers = {
      's': 1000,
      'm': 60 * 1000,
      'h': 60 * 60 * 1000,
      'd': 24 * 60 * 60 * 1000,
      'w': 7 * 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit as keyof typeof multipliers] || multipliers.d);
  }
}