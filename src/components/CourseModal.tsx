import React, { useState } from 'react';
import Button from './Button';
import BookingForm from './BookingForm';
import type { Course } from '../types';

interface CourseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, isOpen, onClose }) => {
  const [selectedTransmission, setSelectedTransmission] = useState('manual');
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (!isOpen) return null;

  const handleBookNow = () => {
    try {
      const message = `Hi, I'm interested in booking the ${course.title} course (${selectedTransmission} transmission). Price: ${course.price}. Please provide more details.`;
      const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setShowBookingForm(true);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const handleMaybeLater = () => {
    onClose();
    try {
      window.dispatchEvent(new Event('triggerExitIntent'));
    } catch (error) {
      console.error('Error triggering exit intent:', error);
    }
  };

  const handleTransmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTransmission(e.target.value);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-900">{course.title} Course</h2>
            <button
              onClick={onClose}
              className="text-secondary-600 hover:text-primary-500 text-2xl"
              aria-label="Close modal"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Live Course Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary-500">{course.registeredStudents}</div>
                      <div className="text-sm text-secondary-600">Registered Students</div>
                    </div>
                    <div className="bg-success-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-success-500">{course.passRate}%</div>
                      <div className="text-sm text-secondary-600">Pass Rate</div>
                    </div>
                    <div className="bg-accent-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent-500">{course.rating}</div>
                      <div className="text-sm text-secondary-600">Rating</div>
                    </div>
                    <div className="bg-secondary-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary-500">{course.totalHours}h</div>
                      <div className="text-sm text-secondary-600">Total Hours</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Course Price</h3>
                  <div className="text-3xl font-bold text-accent-500 mb-2">{course.price}</div>
                  <p className="text-secondary-600">Includes all lessons and materials</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Choose Transmission Type</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="transmission"
                        value="manual"
                        checked={selectedTransmission === 'manual'}
                        onChange={handleTransmissionChange}
                        className="mr-2"
                      />
                      <span className="text-secondary-700">Manual</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="transmission"
                        value="automatic"
                        checked={selectedTransmission === 'automatic'}
                        onChange={handleTransmissionChange}
                        className="mr-2"
                      />
                      <span className="text-secondary-700">Automatic</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {course.fullFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-secondary-700">
                        <i className="bi bi-check-circle text-success-500 mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Why Choose This Course</h3>
                  <p className="text-secondary-700 leading-relaxed">{course.whyChoose}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button size="lg" onClick={handleBookNow} className="flex-1">
                <i className="bi bi-calendar-check mr-2"></i>
                Book Now
              </Button>
              <Button variant="outline" size="lg" onClick={handleMaybeLater} className="flex-1">
                <i className="bi bi-clock mr-2"></i>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          course={course}
          transmission={selectedTransmission}
        />
      )}
    </>
  );
};

export default CourseModal;
