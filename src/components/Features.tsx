import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';

const Features: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const processSteps = [
    {
      icon: 'bi-file-earmark-text',
      title: 'Apply For A DVLA Provisional License',
      subtitle: 'Get your provisional driving license to start learning',
      buttonText: 'Apply via DVLA',
      animationDelay: '0s',
      hoverInfo: 'You can apply online at gov.uk or by post. You must be at least 17 years old (16 for moped). You\'ll need proof of identity and address. The license costs £34 online or £43 by post.',
      action: () => window.open('https://www.gov.uk/apply-first-provisional-driving-licence', '_blank')
    },
    {
      icon: 'bi-book',
      title: 'Start Your Theory Lessons',
      subtitle: 'Learn the Highway Code and Traffic Rules',
      buttonText: 'Book Theory Course',
      animationDelay: '0.2s',
      hoverInfo: 'Study the Highway Code, road signs, and traffic laws. Use official DVSA apps and practice tests. We recommend at least 20 hours of theory study. You can study independently or take our theory courses.',
      action: () => scrollToSection('courses')
    },
    {
      icon: 'bi-clipboard-check',
      title: 'Prepare & Pass Theory Test',
      subtitle: 'Take the official DVSA theory test',
      buttonText: 'Book Theory Test',
      animationDelay: '0.4s',
      hoverInfo: 'The theory test has 50 multiple choice questions (pass mark: 43/50) plus a hazard perception test (pass mark: 44/75). The test costs £23 and you\'ll get your results immediately.',
      action: () => window.open('https://www.gov.uk/book-theory-test', '_blank')
    },
    {
      icon: 'bi-calendar-plus',
      title: 'Book For Practical Test',
      subtitle: 'Schedule Your Practical Driving Test',
      buttonText: 'Book Practical Test',
      animationDelay: '0.6s',
      hoverInfo: 'You can only book your practical test after passing your theory test. The practical test costs £62 (£75 evenings/weekends). Book early as waiting times can be several weeks.',
      action: () => window.open('https://www.gov.uk/book-driving-test', '_blank')
    },
    {
      icon: 'bi-car-front',
      title: 'Start Practical Classes',
      subtitle: 'Learn To Drive Professional Instructors',
      buttonText: 'Book Lessons',
      animationDelay: '0.8s',
      hoverInfo: 'The average learner needs 40-50 hours of professional lessons plus 20+ hours of private practice. We offer flexible scheduling, expert instructors, and modern dual-control cars for your safety.',
      action: () => scrollToSection('instructors')
    },
    {
      icon: 'bi-trophy',
      title: 'Prepare & Pass Practical Test',
      subtitle: 'Get Your Full UK Drivers License',
      buttonText: 'Pass Once',
      animationDelay: '1s',
      hoverInfo: 'The practical test lasts about 40 minutes including independent driving and possibly a maneuvers. Pass rate is around 45%. If you pass, you\'ll get your full license within 3 weeks!',
      action: () => scrollToSection('courses')
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            UK Driver's License Process Simplified
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Follow our step-by-step guide to getting your UK driving license. We'll support you through every stage of your journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <Card 
              key={index} 
              className={`text-center relative animate-fade-in-up border-2 border-primary-100 hover:border-primary-300 transition-all duration-500 transform cursor-pointer group ${
                hoveredStep === index ? 'scale-110 shadow-2xl z-10' : 'hover:scale-105 hover:shadow-xl'
              }`}
              style={{ animationDelay: step.animationDelay }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-icon-pulse group-hover:scale-110 transition-transform duration-300">
                <i className={`${step.icon} text-white text-xl`}></i>
              </div>
              
              <div className="transition-all duration-500">
                <h3 className="text-lg font-bold text-primary-900 mb-2">{step.title}</h3>
                <p className="text-secondary-600 text-sm mb-6 font-medium">{step.subtitle}</p>
                
                {hoveredStep === index && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{step.hoverInfo}</p>
                  </div>
                )}
                
                <Button size="sm" className="w-full bg-gradient-primary hover:bg-gradient-primary-hover" onClick={step.action}>
                  {step.buttonText}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
