import React, { useState, useEffect } from 'react';
import Button from './Button';

const ExitIntentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    drivingLevel: 'beginner',
    transmission: 'manual'
  });

  useEffect(() => {
    let mouseLeaveTimer: number | undefined;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        mouseLeaveTimer = window.setTimeout(() => {
          setIsOpen(true);
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimer) {
        window.clearTimeout(mouseLeaveTimer);
        mouseLeaveTimer = undefined;
      }
    };

    const handleTriggerExitIntent = () => {
      setIsOpen(true);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('triggerExitIntent', handleTriggerExitIntent);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('triggerExitIntent', handleTriggerExitIntent);
      if (mouseLeaveTimer) {
        window.clearTimeout(mouseLeaveTimer);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Free Class Request:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Driving Level: ${formData.drivingLevel}
Preferred Transmission: ${formData.transmission}`;
    
    const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full animate-bounce-in">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Claim 60 Minutes Free Class</h2>
            <p className="text-sm text-secondary-600">Don't miss this limited-time offer!</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-secondary-600 hover:text-primary-500 text-2xl"
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Driving Level
            </label>
            <select
              name="drivingLevel"
              value={formData.drivingLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="absolute-beginner">Absolute Beginner</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Preferred Car Transmission
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
          
          <Button type="submit" size="lg" className="w-full">
            <i className="bi bi-gift mr-2"></i>
            Claim Free Class Now
          </Button>
          
          <p className="text-xs text-secondary-600 text-center mt-4">
            * Limited time offer. Terms and conditions apply.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ExitIntentModal;
