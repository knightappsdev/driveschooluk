import React, { useState, useEffect } from 'react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 animate-bounce-gentle"
          title="Scroll to top"
        >
          <i className="bi bi-arrow-up text-xl"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
