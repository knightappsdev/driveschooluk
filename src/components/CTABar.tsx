import React from 'react';
import Button from './Button';

const CTABar: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500 to-secondary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Driving Journey?
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-4xl mx-auto">
            Our expert instructors will guide you through every step. Get personalized support and increase your chances of passing first time!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100 w-full sm:w-auto" onClick={() => scrollToSection('courses')}>
              <i className="bi bi-calendar-check mr-2"></i>
              Book Your First Lesson
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-500 w-full sm:w-auto" onClick={() => scrollToSection('contact')}>
              <i className="bi bi-chat-dots mr-2"></i>
              Get Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABar;
