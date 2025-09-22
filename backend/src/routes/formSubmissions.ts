import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Submit learner inquiry form
router.post('/learner-inquiry', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      emergencyContact,
      emergencyPhone,
      preferredTransmission,
      experience,
      availability,
      message,
      password,
      createAccount
    } = req.body;

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!firstName?.trim()) errors['firstName'] = 'First name is required';
    if (!lastName?.trim()) errors['lastName'] = 'Last name is required';
    if (!email?.trim()) errors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors['email'] = 'Please enter a valid email address';
    }
    if (!phone?.trim()) errors['phone'] = 'Phone number is required';
    if (!dateOfBirth) errors['dateOfBirth'] = 'Date of birth is required';
    
    // Check age requirement
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 17) {
        errors['dateOfBirth'] = 'You must be at least 17 years old to learn to drive';
      }
    }

    if (!preferredTransmission) errors['preferredTransmission'] = 'Please select transmission type';
    
    if (createAccount && !password) {
      errors['password'] = 'Password is required when creating an account';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the following errors',
        errors
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && createAccount) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
        errors: { email: 'Email already registered' }
      });
    }

    // Create form submission
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      emergencyContact,
      emergencyPhone,
      preferredTransmission,
      experience,
      availability,
      message
    };

    const submission = await prisma.formSubmission.create({
      data: {
        type: 'LEARNER_INQUIRY',
        formData: JSON.stringify(formData),
        status: 'NEW',
        source: req.headers.referer || 'Direct',
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null
      }
    });

    let user = null;
    let learnerProfile = null;

    // Create user account if requested
    if (createAccount) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'LEARNER',
          status: 'PENDING_VERIFICATION',
          firstName,
          lastName,
          phone
        }
      });

      // Create learner profile
      learnerProfile = await prisma.learnerProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(dateOfBirth),
          address,
          emergencyContact,
          emergencyPhone
        }
      });

      // Update submission with user ID
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { userId: user.id }
      });

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to DriveConnect UK!',
          message: `Welcome ${firstName}! Your learner inquiry has been submitted successfully. Our team will contact you soon to discuss your driving lessons.`,
          type: 'SYSTEM'
        }
      });
    }

    return res.json({
      success: true,
      message: createAccount 
        ? 'Account created successfully! Please check your email for verification instructions.'
        : 'Your inquiry has been submitted successfully. We will contact you soon!',
      submissionId: submission.id,
      userId: user?.id,
      learnerProfileId: learnerProfile?.id
    });

  } catch (error) {
    console.error('Learner inquiry submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'There was an error processing your inquiry. Please try again.',
      errors: { general: 'Submission failed' }
    });
  }
});

// Submit instructor inquiry form
router.post('/instructor-inquiry', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      experience,
      qualifications,
      vehicleType,
      availability,
      hourlyRate,
      specializations,
      bio,
      message,
      password,
      createAccount
    } = req.body;

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!firstName?.trim()) errors['firstName'] = 'First name is required';
    if (!lastName?.trim()) errors['lastName'] = 'Last name is required';
    if (!email?.trim()) errors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors['email'] = 'Please enter a valid email address';
    }
    if (!phone?.trim()) errors['phone'] = 'Phone number is required';
    if (!experience || experience < 0) errors['experience'] = 'Experience is required';
    if (!qualifications?.trim()) errors['qualifications'] = 'Qualifications are required';
    
    if (createAccount && !password) {
      errors['password'] = 'Password is required when creating an account';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the following errors',
        errors
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && createAccount) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
        errors: { email: 'Email already registered' }
      });
    }

    // Create form submission
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      experience,
      qualifications,
      vehicleType,
      availability,
      hourlyRate,
      specializations,
      bio,
      message
    };

    const submission = await prisma.formSubmission.create({
      data: {
        type: 'INSTRUCTOR_INQUIRY',
        formData: JSON.stringify(formData),
        status: 'NEW',
        source: req.headers.referer || 'Direct',
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null
      }
    });

    let user = null;
    let instructorProfile = null;

    // Create user account if requested
    if (createAccount) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'INSTRUCTOR',
          status: 'PENDING_VERIFICATION',
          firstName,
          lastName,
          phone
        }
      });

      // Generate instructor license number
      const instructorCount = await prisma.instructorProfile.count();
      const licenseNumber = `ADI-${(instructorCount + 1).toString().padStart(3, '0')}-${firstName.charAt(0)}${lastName.charAt(0)}`;

      // Create instructor profile
      instructorProfile = await prisma.instructorProfile.create({
        data: {
          userId: user.id,
          instructorLicense: licenseNumber,
          vehicleType,
          experience: parseInt(experience),
          specializations: JSON.stringify(specializations || []),
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
          bio,
          qualifications: JSON.stringify(qualifications.split(',').map((q: any) => q.trim())),
          isActive: false // Needs admin approval
        }
      });

      // Update submission with user ID
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: { userId: user.id }
      });

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to DriveConnect UK!',
          message: `Welcome ${firstName}! Your instructor application has been submitted. Your profile is pending admin review and approval.`,
          type: 'SYSTEM'
        }
      });
    }

    return res.json({
      success: true,
      message: createAccount 
        ? 'Instructor account created successfully! Your profile is pending admin approval.'
        : 'Your instructor inquiry has been submitted successfully. We will review your application and contact you soon!',
      submissionId: submission.id,
      userId: user?.id,
      instructorProfileId: instructorProfile?.id
    });

  } catch (error) {
    console.error('Instructor inquiry submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'There was an error processing your inquiry. Please try again.',
      errors: { general: 'Submission failed' }
    });
  }
});

// Get all form submissions (Admin only)
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    // Check admin permissions
    if (!req.user || (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin permissions required.'
      });
    }

    const { type, status, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.formSubmission.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        submissions: submissions.map(submission => ({
          ...submission,
          formData: JSON.parse(submission.formData)
        })),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      }
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching form submissions'
    });
  }
});

// Update submission status (Admin only)
router.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    // Check admin permissions
    if (!req.user || (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin permissions required.'
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required'
      });
    }
    const { status, notes } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: {
        status,
        notes,
        processedBy: req.user?.id || null,
        processedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create notification if user exists
    if (submission.userId) {
      const statusMessages = {
        CONTACTED: 'We have reviewed your inquiry and will be in touch soon.',
        CONVERTED: 'Welcome! Your inquiry has been approved and processed.',
        ARCHIVED: 'Your inquiry has been archived. Please contact us if you need assistance.'
      };

      if (statusMessages[status as keyof typeof statusMessages]) {
        await prisma.notification.create({
          data: {
            userId: submission.userId,
            title: 'Inquiry Status Update',
            message: statusMessages[status as keyof typeof statusMessages],
            type: 'SYSTEM'
          }
        });
      }
    }

    return res.json({
      success: true,
      message: 'Submission status updated successfully',
      data: {
        ...submission,
        formData: JSON.parse(submission.formData)
      }
    });

  } catch (error) {
    console.error('Update submission status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating submission status'
    });
  }
});

// Get submission by ID
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required'
      });
    }
    
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        processor: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check permissions
    if (req.user && req.user.role === 'LEARNER' && submission.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.json({
      success: true,
      data: {
        ...submission,
        formData: JSON.parse(submission.formData)
      }
    });

  } catch (error) {
    console.error('Get submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

export default router;