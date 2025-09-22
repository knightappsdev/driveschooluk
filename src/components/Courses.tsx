import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import CourseModal from './CourseModal';
import type { Course } from '../types';

const Courses: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courses: Course[] = [
    {
      id: 1,
      icon: 'bi-person-plus',
      title: 'Absolute Beginner',
      subtitle: 'Perfect for those who have never been behind the wheel',
      hours: '45-50 hours',
      price: '£1,350',
      features: ['Basic vehicle controls', 'Road awareness', 'Parking fundamentals', 'Highway Code basics'],
      registeredStudents: 1247,
      passRate: 92,
      rating: 4.8,
      totalHours: 50,
      whyChoose: 'Our comprehensive beginner course is designed for complete newcomers to driving. With patient, experienced instructors and a structured learning approach, you will build confidence from your very first lesson.',
      fullFeatures: [
        'Complete vehicle familiarization',
        'Basic controls and safety checks',
        'Road positioning and awareness',
        'Traffic rules and regulations',
        'Parking and maneuvering',
        'Highway Code theory',
        'Mock theory tests',
        'Pre-test preparation'
      ]
    },
    {
      id: 2,
      icon: 'bi-person-check',
      title: 'Beginner',
      subtitle: 'For those with some basic knowledge but limited practical experience',
      hours: '35-40 hours',
      price: '£1,050',
      features: ['Building confidence', 'Traffic navigation', 'Advanced parking', 'Test preparation'],
      registeredStudents: 892,
      passRate: 94,
      rating: 4.7,
      totalHours: 40,
      whyChoose: 'Perfect for those who have some driving knowledge but need structured practice. Our beginner course focuses on building real-world driving skills and confidence.',
      fullFeatures: [
        'Confidence building exercises',
        'Complex traffic situations',
        'Advanced parking techniques',
        'Roundabout navigation',
        'Dual carriageway driving',
        'Test route practice',
        'Hazard perception training',
        'Final test preparation'
      ]
    },
    {
      id: 3,
      icon: 'bi-speedometer2',
      title: 'Intermediate',
      subtitle: 'Advance your skills with more complex driving scenarios',
      hours: '25-30 hours',
      price: '£750',
      features: ['Complex junctions', 'Dual carriageways', 'Night driving', 'Weather conditions'],
      registeredStudents: 634,
      passRate: 96,
      rating: 4.9,
      totalHours: 30,
      whyChoose: 'Designed for drivers who have basic skills but need to master more challenging driving scenarios. Focus on advanced techniques and real-world application.',
      fullFeatures: [
        'Complex junction navigation',
        'Motorway and dual carriageway skills',
        'Night and adverse weather driving',
        'Advanced maneuvering',
        'Independent driving practice',
        'Test standard refinement',
        'Emergency procedures',
        'Eco-driving techniques'
      ]
    },
    {
      id: 4,
      icon: 'bi-award',
      title: 'Advanced',
      subtitle: 'Master advanced techniques and prepare for your test',
      hours: '15-20 hours',
      price: '£450',
      features: ['Test refinement', 'Advanced maneuvers', 'Mock tests', 'Final preparation'],
      registeredStudents: 423,
      passRate: 98,
      rating: 4.9,
      totalHours: 20,
      whyChoose: 'The final step to test success. Our advanced course polishes your skills to test standard and beyond, ensuring you pass with confidence.',
      fullFeatures: [
        'Test standard refinement',
        'Advanced maneuvering techniques',
        'Multiple mock driving tests',
        'Test route familiarization',
        'Examiner expectations training',
        'Last-minute preparation',
        'Confidence building',
        'Post-test driving advice'
      ]
    }
  ];

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <section id="courses" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Choose Your Perfect Course
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              From complete beginners to advanced drivers, we have the perfect course for your skill level
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="text-left relative group hover:scale-105 transition-transform duration-300 cursor-pointer border-2 border-primary-100 hover:border-primary-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${course.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.subtitle}</p>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <i className="bi bi-clock text-gray-600 mr-2"></i>
                      <span className="text-sm text-gray-600">{course.hours}</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">{course.price}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-primary-900 mb-3">What&apos;s included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {course.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <i className="bi bi-check-circle text-secondary-500 mr-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                  onClick={() => handleViewDetails(course)}
                >
                  View Details & Book
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen && selectedCourse && (
        <CourseModal
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Courses;
