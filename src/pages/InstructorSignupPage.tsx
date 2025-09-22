import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const InstructorSignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    religion: '',
    ethnicity: '',
    address: '',
    city: '',
    postcode: '',
    
    // Professional Information
    experience: '',
    transmission: 'both',
    specialty: '',
    hourlyRate: '',
    availability: '',
    licenseNumber: '',
    licenseExpiry: '',
    insuranceProvider: '',
    insuranceExpiry: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleRegistration: '',
    
    // Qualifications
    adiNumber: '',
    adiExpiry: '',
    drivingLicenseNumber: '',
    drivingLicenseExpiry: '',
    criminalRecord: '',
    references: '',
    
    // Additional Information
    languages: '',
    summary: '',
    whyJoin: '',
    marketingConsent: false,
    termsAccepted: false
  });

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `New Instructor Application:
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
City: ${formData.city}
Experience: ${formData.experience} years
ADI Number: ${formData.adiNumber}
Hourly Rate: £${formData.hourlyRate}
Summary: ${formData.summary}`;
    
    const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
                <input
                  type="text"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
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
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Professional Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Transmission *</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="manual">Manual Only</option>
                  <option value="automatic">Automatic Only</option>
                  <option value="both">Both Manual & Automatic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="e.g., Nervous Drivers, Test Preparation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (£) *</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                  min="20"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
              <textarea
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                placeholder="e.g., Mon-Fri: 9AM-6PM, Weekends: 10AM-4PM"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider *</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Expiry Date *</label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Make *</label>
                <input
                  type="text"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model *</label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Year *</label>
                <input
                  type="number"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  required
                  min="2010"
                  max="2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration *</label>
                <input
                  type="text"
                  name="vehicleRegistration"
                  value={formData.vehicleRegistration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Qualifications & Licenses</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ADI Number *</label>
                <input
                  type="text"
                  name="adiNumber"
                  value={formData.adiNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ADI Expiry Date *</label>
                <input
                  type="date"
                  name="adiExpiry"
                  value={formData.adiExpiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Number *</label>
                <input
                  type="text"
                  name="drivingLicenseNumber"
                  value={formData.drivingLicenseNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Expiry *</label>
                <input
                  type="date"
                  name="drivingLicenseExpiry"
                  value={formData.drivingLicenseExpiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Criminal Record Check</label>
              <select
                name="criminalRecord"
                value={formData.criminalRecord}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="clear">Clear DBS Check</option>
                <option value="pending">DBS Check Pending</option>
                <option value="expired">DBS Check Expired</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional References</label>
              <textarea
                name="references"
                value={formData.references}
                onChange={handleChange}
                placeholder="Please provide contact details for 2 professional references"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., English, Spanish, French"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary-900 mb-6">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary *</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                placeholder="Tell us about your teaching style, experience, and what makes you a great instructor..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join our platform? *</label>
              <textarea
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleChange}
                required
                placeholder="What attracts you to our platform and how do you plan to contribute?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
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
                  I consent to receiving marketing communications and updates about the platform
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
            <h1 className="text-2xl font-bold text-primary-900">Instructor Application</h1>
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
                    className="bg-gradient-primary hover:bg-gradient-primary-hover"
                  >
                    <i className="bi bi-send mr-2"></i>
                    Submit Application
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstructorSignupPage;
