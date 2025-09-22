// Form Submission Service
// Handles form data submission and processing

export interface FormSubmissionData {
  formType: 'learner_inquiry' | 'instructor_inquiry' | 'contact' | 'newsletter' | 'booking_request';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  formData: Record<string, unknown>;
  submissionSource: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  userId?: string;
  learnerProfileId?: string;
  instructorProfileId?: string;
  errors?: Record<string, string>;
}

export interface FormSubmission {
  id: string;
  formType: 'learner_inquiry' | 'instructor_inquiry' | 'contact' | 'newsletter' | 'booking_request';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  formData: Record<string, unknown>;
  submissionSource: string;
  status: string;
  submissionDate: string;
  ipAddress?: string;
  userAgent?: string;
  updatedAt?: string;
}

class FormSubmissionService {
  private baseUrl: string;

  constructor() {
    // In a real app, this would come from environment variables
    this.baseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  async submitForm(data: FormSubmissionData): Promise<SubmissionResponse> {
    try {
      const endpoint = data.formType === 'learner_inquiry' 
        ? '/api/form-submissions/learner-inquiry'
        : '/api/form-submissions/instructor-inquiry';

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'There was an error submitting your form.',
          errors: result.errors || { general: 'Submission failed' }
        };
      }

      return {
        success: true,
        message: result.message,
        submissionId: result.submissionId,
        userId: result.userId,
        learnerProfileId: result.learnerProfileId,
        instructorProfileId: result.instructorProfileId
      };

    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        message: 'There was an error submitting your form. Please try again.',
        errors: { general: 'Network error or server unavailable' }
      };
    }
  }

  async getLearnerSubmissions(): Promise<FormSubmission[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/api/form-submissions?type=LEARNER_INQUIRY`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch learner submissions');
      }

      const result = await response.json();
      return result.data.submissions || [];
    } catch (error) {
      console.error('Error fetching learner submissions:', error);
      return [];
    }
  }

  async getInstructorSubmissions(): Promise<FormSubmission[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/api/form-submissions?type=INSTRUCTOR_INQUIRY`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch instructor submissions');
      }

      const result = await response.json();
      return result.data.submissions || [];
    } catch (error) {
      console.error('Error fetching instructor submissions:', error);
      return [];
    }
  }

  async getAllSubmissions(): Promise<FormSubmission[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/api/form-submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all submissions');
      }

      const result = await response.json();
      return result.data.submissions || [];
    } catch (error) {
      console.error('Error fetching all submissions:', error);
      return [];
    }
  }

  async updateSubmissionStatus(submissionId: string, status: string, notes?: string): Promise<SubmissionResponse> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseUrl}/api/form-submissions/${submissionId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Error updating submission status'
        };
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error('Error updating submission status:', error);
      return {
        success: false,
        message: 'Network error or server unavailable'
      };
    }
  }

  private getStoredSubmissions(): FormSubmission[] {
    try {
      const stored = localStorage.getItem('form_submissions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    return 'sub_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validation methods
  validateLearnerForm(formData: Record<string, unknown>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!formData.firstName || typeof formData.firstName !== 'string' || !formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName || typeof formData.lastName !== 'string' || !formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email || typeof formData.email !== 'string' || !formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || typeof formData.phone !== 'string' || !formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.dateOfBirth || typeof formData.dateOfBirth !== 'string') {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = this.calculateAge(formData.dateOfBirth);
      if (age < 17) {
        errors.dateOfBirth = 'You must be at least 17 years old to learn to drive';
      }
    }

    if (!formData.preferredTransmission || typeof formData.preferredTransmission !== 'string') {
      errors.preferredTransmission = 'Please select your preferred transmission type';
    }

    if (!formData.password || typeof formData.password !== 'string') {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted || typeof formData.termsAccepted !== 'boolean' || !formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateInstructorForm(formData: Record<string, unknown>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!formData.firstName || typeof formData.firstName !== 'string' || !formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName || typeof formData.lastName !== 'string' || !formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email || typeof formData.email !== 'string' || !formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.adiNumber || typeof formData.adiNumber !== 'string' || !formData.adiNumber.trim()) {
      errors.adiNumber = 'ADI number is required';
    }

    if (!formData.yearsExperience || typeof formData.yearsExperience !== 'number' || formData.yearsExperience < 1) {
      errors.yearsExperience = 'Years of experience is required and must be at least 1';
    }

    if (!formData.hourlyRate || typeof formData.hourlyRate !== 'number' || formData.hourlyRate < 10) {
      errors.hourlyRate = 'Hourly rate is required and must be at least £10';
    }

    if (!formData.transmissionType || typeof formData.transmissionType !== 'string') {
      errors.transmissionType = 'Transmission type is required';
    }

    if (!formData.serviceAreas || !Array.isArray(formData.serviceAreas) || formData.serviceAreas.length === 0) {
      errors.serviceAreas = 'At least one service area is required';
    }

    if (!formData.termsAccepted || typeof formData.termsAccepted !== 'boolean' || !formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}

export const formSubmissionService = new FormSubmissionService();