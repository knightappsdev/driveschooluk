import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <i className="bi bi-car-front text-white"></i>
            </div>
            <span className="text-2xl font-bold">DriveConnect UK</span>
          </div>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Connecting learner drivers with qualified instructors across the United Kingdom.
          </p>
        </div>
        
        <div className="border-t border-primary-800 pt-8 mt-8 text-center">
          <p className="text-primary-200 text-sm">
            © 2024 DriveConnect UK. All rights reserved. | 
            Powered by <span className="bg-gradient-primary bg-clip-text text-transparent font-medium">Websparks AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
