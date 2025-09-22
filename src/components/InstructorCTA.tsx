import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const InstructorCTA: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-secondary-500 to-primary-500 min-h-[200px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            You love to train students to drive?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-4xl mx-auto">
            Join thousands of other successful instructors on our platform
          </p>
          <div className="flex justify-center">
            <Link to="/instructor-signup">
              <Button 
                size="lg" 
                className="bg-white text-primary-500 hover:bg-gray-100 hover:text-primary-600"
              >
                <i className="bi bi-person-plus mr-2"></i>
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorCTA;
