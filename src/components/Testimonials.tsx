import React, { useState, useEffect } from 'react';
import Card from './Card';

const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Manchester',
      rating: 5,
      text: 'Found an amazing instructor through DriveConnect UK. Passed my test first time! The booking system was so easy to use.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'James Mitchell',
      location: 'Birmingham',
      rating: 5,
      text: 'Excellent service! My instructor was patient, professional, and helped me build confidence behind the wheel. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Emma Thompson',
      location: 'London',
      rating: 5,
      text: 'The progress tracking feature was brilliant. I could see exactly what I needed to work on before my test. Passed with only 2 minors!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Michael Brown',
      location: 'Leeds',
      rating: 5,
      text: 'Great platform for finding qualified instructors. My instructor was punctual, knowledgeable, and made learning enjoyable.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Lisa Davis',
      location: 'Bristol',
      rating: 5,
      text: 'Fantastic experience from start to finish. The instructor matching system worked perfectly and I passed on my second attempt.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'David Wilson',
      location: 'Liverpool',
      rating: 5,
      text: 'Professional service and excellent instructors. The online booking made everything so convenient. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return testimonials.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white min-h-[600px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            What Our Students Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful drivers who found their perfect instructor through DriveConnect UK.
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <i className="bi bi-chevron-left text-primary-500 text-lg"></i>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <i className="bi bi-chevron-right text-primary-500 text-lg"></i>
              </button>
            </>
          )}

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {getCurrentTestimonials().map((testimonial, index) => (
              <Card key={`${currentSlide}-${index}`} hover className="border-2 border-primary-100 hover:border-primary-300 min-h-[250px] flex flex-col">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    crossOrigin="anonymous"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-primary-900 text-base">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-secondary-500 text-sm"></i>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">{testimonial.text}</p>
              </Card>
            ))}
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
