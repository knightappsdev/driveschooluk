import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env['SMTP_HOST'] || 'smtp.ethereal.email',
      port: parseInt(process.env['SMTP_PORT'] || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env['SMTP_USER'],
        pass: process.env['SMTP_PASS'],
      },
    });

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        logger.error('Email transporter verification failed:', error);
      } else {
        logger.info('Email server connection established');
      }
    });
  }

  async sendVerificationEmail(email: string, firstName: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env['FRONTEND_URL']}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: process.env['FROM_EMAIL'] || 'noreply@driveconnectuk.com',
        to: email,
        subject: 'Verify Your DriveConnect UK Account',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
              .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .button { 
                display: inline-block; 
                background-color: #3B82F6; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚗 Welcome to DriveConnect UK!</h1>
              </div>
              <div class="content">
                <h2>Hi ${firstName},</h2>
                <p>Thank you for registering with DriveConnect UK! Please verify your email address to complete your account setup.</p>
                
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
                
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                
                <p>If you didn't create an account with us, please ignore this email.</p>
                
                <p>Best regards,<br>The DriveConnect UK Team</p>
              </div>
              <div class="footer">
                <p>This email was sent to ${email}. If you didn't request this, please ignore this email.</p>
                <p>© 2024 DriveConnect UK. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to: ${email}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, firstName: string, token: string): Promise<void> {
    try {
      const resetUrl = `${process.env['FRONTEND_URL']}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: process.env['FROM_EMAIL'] || 'noreply@driveconnectuk.com',
        to: email,
        subject: 'Reset Your DriveConnect UK Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
              .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .button { 
                display: inline-block; 
                background-color: #EF4444; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
              .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔒 Password Reset Request</h1>
              </div>
              <div class="content">
                <h2>Hi ${firstName},</h2>
                <p>You requested a password reset for your DriveConnect UK account. Click the button below to set a new password:</p>
                
                <a href="${resetUrl}" class="button">Reset Password</a>
                
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong>
                  <ul>
                    <li>This link will expire in 15 minutes for security reasons</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your password will remain unchanged until you complete the reset process</li>
                  </ul>
                </div>
                
                <p>Best regards,<br>The DriveConnect UK Team</p>
              </div>
              <div class="footer">
                <p>This email was sent to ${email}. If you didn't request this, please ignore this email.</p>
                <p>© 2024 DriveConnect UK. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to: ${email}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }

  async sendAssignmentNotification(
    instructorEmail: string, 
    instructorName: string, 
    learnerName: string,
    assignmentDetails: {
      startDate: string;
      notes?: string;
    }
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env['FROM_EMAIL'] || 'noreply@driveconnectuk.com',
        to: instructorEmail,
        subject: `New Student Assignment - ${learnerName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
              .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .assignment-card { 
                border: 1px solid #E5E7EB; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0; 
                background-color: #F9FAFB; 
              }
              .button { 
                display: inline-block; 
                background-color: #10B981; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>👨‍🏫 New Student Assignment</h1>
              </div>
              <div class="content">
                <h2>Hi ${instructorName},</h2>
                <p>You have been assigned a new student! Please review the details below:</p>
                
                <div class="assignment-card">
                  <h3>📋 Assignment Details</h3>
                  <p><strong>Student:</strong> ${learnerName}</p>
                  <p><strong>Start Date:</strong> ${assignmentDetails.startDate}</p>
                  ${assignmentDetails.notes ? `<p><strong>Notes:</strong> ${assignmentDetails.notes}</p>` : ''}
                </div>
                
                <a href="${process.env['FRONTEND_URL']}/dashboard/assignments" class="button">View Dashboard</a>
                
                <p>Please log in to your dashboard to:</p>
                <ul>
                  <li>View complete student profile</li>
                  <li>Schedule lessons</li>
                  <li>Track progress</li>
                  <li>Communicate with the student</li>
                </ul>
                
                <p>Best regards,<br>The DriveConnect UK Team</p>
              </div>
              <div class="footer">
                <p>© 2024 DriveConnect UK. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Assignment notification sent to instructor: ${instructorEmail}`);
    } catch (error) {
      logger.error(`Failed to send assignment notification to ${instructorEmail}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string, role: string): Promise<void> {
    try {
      const dashboardUrl = `${process.env['FRONTEND_URL']}/dashboard`;
      
      const mailOptions = {
        from: process.env['FROM_EMAIL'] || 'noreply@driveconnectuk.com',
        to: email,
        subject: `Welcome to DriveConnect UK - Your ${role} Account is Ready!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
              .header { background-color: #8B5CF6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .feature-list { background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { 
                display: inline-block; 
                background-color: #8B5CF6; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
              }
              .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to DriveConnect UK!</h1>
              </div>
              <div class="content">
                <h2>Hi ${firstName},</h2>
                <p>Congratulations! Your ${role.toLowerCase()} account has been successfully created and verified.</p>
                
                <div class="feature-list">
                  <h3>🚀 What's next?</h3>
                  ${role === 'INSTRUCTOR' ? `
                    <ul>
                      <li>Complete your instructor profile</li>
                      <li>Set your availability schedule</li>
                      <li>Wait for student assignments</li>
                      <li>Start teaching and tracking progress</li>
                    </ul>
                  ` : `
                    <ul>
                      <li>Complete your learner profile</li>
                      <li>Wait for instructor assignment</li>
                      <li>Schedule your first lesson</li>
                      <li>Track your learning progress</li>
                    </ul>
                  `}
                </div>
                
                <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <p>Happy learning!</p>
                <p>The DriveConnect UK Team</p>
              </div>
              <div class="footer">
                <p>© 2024 DriveConnect UK. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to: ${email}`);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();