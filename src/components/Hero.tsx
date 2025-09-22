import React, { useState, useEffect, useMemo } from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = useMemo(() => [
    'Find Your Perfect Driving Instructor in the UK',
    'Pass Your Test with Expert Guidance',
    'Learn to Drive with Confidence'
  ], []);

  useEffect(() => {
    const currentText = texts[currentIndex];
    let timeout: number;
    
    const typeText = () => {
      timeout = window.setTimeout(() => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            window.setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      }, isDeleting ? 50 : 100);
    };

    typeText();

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [displayText, currentIndex, isDeleting, texts]);

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  };

  return (
    <section id="hero" className="pt-16 sm:pt-20 md:pt-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div className="text-center lg:text-left flex flex-col justify-center h-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900 leading-tight mb-6 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[240px] flex items-center">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Connect with qualified, experienced driving instructors in your area. Pass your test faster with personalized lessons tailored to your learning style.
            </p>
            
            <div className="mb-8 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">2,500+</div>
                <div className="text-xs text-gray-600">Qualified Instructors</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">95%</div>
                <div className="text-xs text-gray-600">Pass Rate</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">50,000+</div>
                <div className="text-xs text-gray-600">Happy Students</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:bg-gradient-primary-hover" onClick={() => scrollToSection('instructors')}>
                <i className="bi bi-search mr-2"></i>
                Find Instructors
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => scrollToSection('courses')}>
                <i className="bi bi-calendar-check mr-2"></i>
                Book Lessons
              </Button>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center h-full min-h-[500px]">
            <div className="relative z-10 bg-gradient-to-b from-blue-200 to-green-200 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md" style={{ height: '450px' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-green-100"></div>
              
              <div className="absolute top-6 right-8 w-8 h-8 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
              
              <div className="absolute top-4 left-8 animate-bounce">
                <div className="flex items-center">
                  <div className="w-6 h-4 bg-white rounded-full opacity-80"></div>
                  <div className="w-8 h-6 bg-white rounded-full opacity-80 -ml-2"></div>
                  <div className="w-6 h-4 bg-white rounded-full opacity-80 -ml-2"></div>
                </div>
              </div>
              
              <div className="absolute bottom-32 left-4">
                <div className="w-2 h-8 bg-amber-800"></div>
                <div className="w-6 h-6 bg-green-600 rounded-full -mt-2 -ml-2"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-600">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-300"></div>
              </div>
              
              <div className="absolute bottom-8 left-0 w-full">
                <div className="animate-pulse absolute">
                  <div className="relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white border-2 border-red-500 w-4 h-3 flex items-center justify-center text-red-500 font-bold text-xs rounded">L</div>
                    <div className="relative">
                      <div className="w-8 h-4 bg-blue-500 rounded-lg relative shadow-md">
                        <div className="w-6 h-2 bg-blue-300 rounded-t-lg absolute top-0 left-1"></div>
                        <div className="w-1 h-1 bg-yellow-200 absolute top-2 left-0 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-200 absolute bottom-2 left-0 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full">
                        <div className="w-1 h-1 bg-gray-600 rounded-full absolute top-0.5 left-0.5"></div>
                      </div>
                      <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full">
                        <div className="w-1 h-1 bg-gray-600 rounded-full absolute top-0.5 left-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-secondary-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-primary-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
