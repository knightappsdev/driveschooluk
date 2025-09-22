import React, { useState } from 'react';
import Button from './Button';
import type { Course } from '../types';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  transmission: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, course, transmission }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const message = `New Booking Request:
Course: ${course.title}
Transmission: ${transmission}
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Price: ${course.price}`;
      
      const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary-900">Complete Your Booking</h2>
          <button
            onClick={onClose}
            className="text-secondary-600 hover:text-primary-500 text-2xl"
            aria-label="Close form"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-primary-900 mb-2">Booking Summary</h3>
            <p className="text-sm text-secondary-700">Course: {course.title}</p>
            <p className="text-sm text-secondary-700">Transmission: {transmission}</p>
            <p className="text-sm text-secondary-700">Price: {course.price}</p>
          </div>
          
          <Button type="submit" size="lg" className="w-full">
            <i className="bi bi-whatsapp mr-2"></i>
            Send Booking Request
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
