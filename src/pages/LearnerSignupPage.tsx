import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { formSubmissionService } from '../services/formSubmissionService';

const LearnerSignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    postcode: '',
    
    // Driving Information
    hasProvisionalLicense: '',
    licenseNumber: '',
    previousExperience: '',
    preferredTransmission: 'manual',
    learningGoals: '',
    availableDays: [] as string[],
    preferredTime: '',
    budget: '',
    
    // Preferences
    instructorGender: '',
    instructorLanguage: '',
    specialRequirements: '',
    
    // Account
    password: '',
    confirmPassword: '',
    marketingConsent: false,
    termsAccepted: false
  });

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'availableDays') {
        setFormData(prev => ({
          ...prev,
          availableDays: checked 
            ? [...prev.availableDays, value]
            : prev.availableDays.filter(day => day !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitErrors({});

    // Validate form data
    const validation = formSubmissionService.validateLearnerForm(formData);
    
    if (!validation.isValid) {
      setSubmitErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await formSubmissionService.submitForm({
        formType: 'learner_inquiry',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.learningGoals,
        formData: formData,
        submissionSource: 'learner_signup_page'
      });

      if (result.success) {
        setSubmitSuccess(true);
        // Reset form
        setCurrentStep(1);
      } else {
        setSubmitErrors({ general: result.message });
      }
    } catch (error) {
      setSubmitErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Driving Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a provisional license? *</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasProvisionalLicense"
                    value="yes"
                    checked={formData.hasProvisionalLicense === 'yes'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasProvisionalLicense"
                    value="no"
                    checked={formData.hasProvisionalLicense === 'no'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasProvisionalLicense"
                    value="applied"
                    checked={formData.hasProvisionalLicense === 'applied'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Applied for one
                </label>
              </div>
            </div>
            
            {formData.hasProvisionalLicense === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Driving Experience</label>
              <select
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Experience Level</option>
                <option value="none">Complete Beginner</option>
                <option value="some">Some Experience</option>
                <option value="failed-test">Failed Test Before</option>
                <option value="refresher">Need Refresher</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Transmission *</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredTransmission"
                    value="manual"
                    checked={formData.preferredTransmission === 'manual'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Manual
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredTransmission"
                    value="automatic"
                    checked={formData.preferredTransmission === 'automatic'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Automatic
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
              <textarea
                name="learningGoals"
                value={formData.learningGoals}
                onChange={handleChange}
                placeholder="What do you hope to achieve? Any specific concerns or goals?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Availability & Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Days (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      name="availableDays"
                      value={day}
                      checked={formData.availableDays.includes(day)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Preferred Time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget per Hour</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Budget Range</option>
                <option value="25-30">£25 - £30</option>
                <option value="30-35">£30 - £35</option>
                <option value="35-40">£35 - £40</option>
                <option value="40-45">£40 - £45</option>
                <option value="45+">£45+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Gender Preference</label>
              <select
                name="instructorGender"
                value={formData.instructorGender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No Preference</option>
                <option value="Male">Male Instructor</option>
                <option value="Female">Female Instructor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
              <input
                type="text"
                name="instructorLanguage"
                value={formData.instructorLanguage}
                onChange={handleChange}
                placeholder="e.g., English, Spanish, Hindi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any special requirements or accessibility needs?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Create Your Account</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Create a strong password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <label className="text-sm text-gray-700">
                  I would like to receive updates about new instructors, special offers, and driving tips
                </label>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1 mr-3"
                />
                <label className="text-sm text-gray-700">
                  I accept the <a href="#" className="text-primary-500 hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a> *
                </label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <i className="bi bi-car-front text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-primary-900">DriveConnect UK</span>
            </Link>
            <Link to="/" className="text-primary-500 hover:text-primary-600">
              <i className="bi bi-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-primary-900">Create Learner Account</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <i className="bi bi-check-circle-fill text-green-600 text-xl mr-3"></i>
                <div>
                  <h3 className="text-green-800 font-medium">Registration Submitted Successfully!</h3>
                  <p className="text-green-600 text-sm mt-1">
                    Thank you for registering! We will review your application and contact you soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {Object.keys(submitErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <i className="bi bi-exclamation-triangle-fill text-red-600 text-xl mr-3 mt-0.5"></i>
                <div className="flex-1">
                  <h3 className="text-red-800 font-medium mb-2">Please correct the following errors:</h3>
                  <ul className="text-red-600 text-sm space-y-1">
                    {Object.entries(submitErrors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="mr-4"
                  >
                    <i className="bi bi-arrow-left mr-2"></i>
                    Previous
                  </Button>
                )}
              </div>
              
              <div>
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-gradient-primary hover:bg-gradient-primary-hover"
                  >
                    Next
                    <i className="bi bi-arrow-right ml-2"></i>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-primary hover:bg-gradient-primary-hover"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus mr-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
          
          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerSignupPage;
