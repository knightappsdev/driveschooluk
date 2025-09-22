import React, { useState } from 'react';
import Button from './Button';

interface InstructorSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructorSignup: React.FC<InstructorSignupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
    transmission: 'both',
    specialty: '',
    hourlyRate: '',
    availability: '',
    licenseNumber: '',
    gender: '',
    nationality: '',
    religion: '',
    ethnicity: '',
    summary: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `New Instructor Application:
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
City: ${formData.city}
Experience: ${formData.experience} years
Transmission: ${formData.transmission}
Specialty: ${formData.specialty}
Hourly Rate: £${formData.hourlyRate}
License Number: ${formData.licenseNumber}
Summary: ${formData.summary}`;
    
    const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-900">Join as Driving Instructor</h2>
          <button
            onClick={onClose}
            className="text-secondary-600 hover:text-primary-500 text-2xl"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">First Name *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Last Name *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Phone Number *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Gender</label>
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
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Professional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">City/Area *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Years of Experience *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Vehicle Transmission *</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Specialty</label>
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
                <label className="block text-sm font-medium text-secondary-700 mb-2">Hourly Rate (£) *</label>
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
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">ADI License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">Brief Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your teaching style and experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button type="submit" size="lg" className="flex-1">
              <i className="bi bi-send mr-2"></i>
              Submit Application
            </Button>
            <Button variant="outline" size="lg" onClick={onClose} className="flex-1">
              <i className="bi bi-x mr-2"></i>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorSignup;
