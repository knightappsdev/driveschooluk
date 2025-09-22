import React from 'react';
import Button from './Button';

const CTA: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gradient-to-r from-primary-500 to-secondary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Driving Journey?
        </h2>
        <p className="text-base sm:text-lg text-white/90 mb-8 max-w-3xl mx-auto">
          Join thousands of learners who have successfully passed their driving test with help from our qualified instructors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100 w-full sm:w-auto" onClick={() => scrollToSection('instructors')}>
            <i className="bi bi-search mr-2"></i>
            Find Your Instructor
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-500 w-full sm:w-auto">
            <i className="bi bi-telephone mr-2"></i>
            Call Us: 0800 123 4567
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
