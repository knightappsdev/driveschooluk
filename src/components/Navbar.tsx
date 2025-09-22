import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error scrolling to section:', error);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <i className="bi bi-car-front text-white text-xl"></i>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DriveConnect UK
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Process
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('instructors')}
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Instructors
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              Contact
            </button>
            <Link to="/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/learner-signup">
              <Button size="sm" className="bg-gradient-primary hover:bg-gradient-primary-hover">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 font-medium"
              >
                Process
              </button>
              <button 
                onClick={() => scrollToSection('courses')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 font-medium"
              >
                Courses
              </button>
              <button 
                onClick={() => scrollToSection('instructors')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 font-medium"
              >
                Instructors
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 font-medium"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 font-medium"
              >
                Contact
              </button>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Link to="/signin">
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/learner-signup">
                  <Button size="sm" className="bg-gradient-primary hover:bg-gradient-primary-hover w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
