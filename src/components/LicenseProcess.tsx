import React, { useState, useEffect } from 'react';
import Button from './Button';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  detailedText: string;
  cost: string;
  timeframe: string;
  requirements: string[];
  actionButton: string;
  actionUrl: string;
}

const LicenseProcess: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [typingText, setTypingText] = useState('');

  const fullTitle = 'UK Driver\'s License Process Simplified';

  const steps: Step[] = [
    {
      id: 1,
      title: 'Apply for Provisional License',
      subtitle: 'Get your provisional license to start learning',
      icon: 'bi-file-earmark-check',
      colorScheme: {
        primary: '#2D5016',
        secondary: '#22C55E',
        accent: '#DCFCE7'
      },
      detailedText: 'Apply for your provisional license online through DVLA. You must be at least 15 years and 9 months old. You\'ll need to provide identity documents, address proof, and pay the £34 fee. Processing takes 1-3 weeks.',
      cost: '£34 online / £43 by post',
      timeframe: '1-3 weeks processing',
      requirements: ['Age 15 years 9 months minimum', 'Valid identity documents', 'Proof of address', 'Passport photo'],
      actionButton: 'Apply via DVLA',
      actionUrl: 'https://www.gov.uk/apply-first-provisional-driving-licence'
    },
    {
      id: 2,
      title: 'Theory Test Preparation',
      subtitle: 'Study highway code and practice theory tests',
      icon: 'bi-laptop',
      colorScheme: {
        primary: '#1E3A8A',
        secondary: '#3B82F6',
        accent: '#DBEAFE'
      },
      detailedText: 'Study the Highway Code and prepare for your theory test. Practice with official DVSA mock tests covering road signs, rules, and hazard perception. You need to score at least 43/50 on multiple choice and 44/75 on hazard perception.',
      cost: 'Free study materials',
      timeframe: '2-4 weeks preparation',
      requirements: ['Highway Code knowledge', 'Practice tests completed', 'Hazard perception training', 'Road signs memorized'],
      actionButton: 'Start Theory Course',
      actionUrl: '#courses'
    },
    {
      id: 3,
      title: 'Book Theory Test',
      subtitle: 'Schedule your official theory examination',
      icon: 'bi-calendar-check',
      colorScheme: {
        primary: '#EA580C',
        secondary: '#F97316',
        accent: '#FED7AA'
      },
      detailedText: 'Book your theory test at an official DVSA test center. The test costs £23 and includes multiple choice questions and hazard perception clips. Bring your provisional license and arrive 15 minutes early.',
      cost: '£23 test fee',
      timeframe: '40 minutes test duration',
      requirements: ['Provisional license', 'Theory preparation complete', 'Test center booking', 'Arrive 15 minutes early'],
      actionButton: 'Book Theory Test',
      actionUrl: 'https://www.gov.uk/book-theory-test'
    },
    {
      id: 4,
      title: 'Start Practical Lessons',
      subtitle: 'Begin learning to drive with qualified instructors',
      icon: 'bi-car-front',
      colorScheme: {
        primary: '#7C2D92',
        secondary: '#A855F7',
        accent: '#F3E8FF'
      },
      detailedText: 'Start practical driving lessons with DVSA approved instructors. Most students need 20-45 hours of professional lessons plus private practice. Focus on vehicle controls, road positioning, observations, and maneuvers.',
      cost: '£30-45 per hour',
      timeframe: '20-45 hours needed',
      requirements: ['Valid provisional license', 'Theory test passed', 'Qualified instructor', 'Dual control vehicle'],
      actionButton: 'Book Lessons',
      actionUrl: '#instructors'
    },
    {
      id: 5,
      title: 'Practice & Perfect Skills',
      subtitle: 'Build confidence with additional practice',
      icon: 'bi-check-circle',
      colorScheme: {
        primary: '#0F766E',
        secondary: '#14B8A6',
        accent: '#CCFBF1'
      },
      detailedText: 'Continue practicing essential driving skills including parallel parking, emergency stops, and independent driving. Your instructor will assess when you\'re ready for the practical test based on consistent safe driving.',
      cost: 'Ongoing lesson costs',
      timeframe: '4-8 weeks practice',
      requirements: ['Consistent safe driving', 'All maneuvers mastered', 'Independent driving skills', 'Instructor recommendation'],
      actionButton: 'Continue Practice',
      actionUrl: '#courses'
    },
    {
      id: 6,
      title: 'Pass Driving Test',
      subtitle: 'Take your practical test and get your full license',
      icon: 'bi-trophy',
      colorScheme: {
        primary: '#D97706',
        secondary: '#F59E0B',
        accent: '#FEF3C7'
      },
      detailedText: 'Book and pass your practical driving test. The test lasts about 40 minutes and costs £62. You\'ll demonstrate vehicle safety checks, general driving ability, and one of three possible maneuvers. Pass rate is approximately 47%.',
      cost: '£62 weekdays / £75 evenings',
      timeframe: '40 minutes test',
      requirements: ['Theory test certificate', 'Sufficient practice hours', 'Instructor recommendation', 'Test-ready skills'],
      actionButton: 'Book Practical Test',
      actionUrl: 'https://www.gov.uk/book-driving-test'
    }
  ];

  useEffect(() => {
    let index = 0;
    let timer: number;
    
    const typeText = () => {
      timer = window.setInterval(() => {
        if (index <= fullTitle.length) {
          setTypingText(fullTitle.slice(0, index));
          index++;
        } else {
          window.clearInterval(timer);
          window.setTimeout(() => setAnimateProgress(true), 500);
        }
      }, 100);
    };

    typeText();

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [fullTitle]);

  const handleStepClick = (step: Step) => {
    setSelectedStep(step);
    setIsModalOpen(true);
  };

  const handleCompleteStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      if (stepId === currentStep) {
        setCurrentStep(stepId + 1);
      }
    }
  };

  const getProgressPercentage = () => {
    return (completedSteps.length / steps.length) * 100;
  };

  return (
    <>
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 min-h-[4rem]">
              {typingText}
              <span className="animate-pulse">|</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Follow our step-by-step guide to getting your UK driving license. We'll support you through every stage of your journey.
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 text-sm">Overall Progress</span>
                <span className="text-primary-600 font-semibold">{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-primary h-3 rounded-full transition-all duration-2000 ease-out ${animateProgress ? 'animate-pulse' : ''}`}
                  style={{ 
                    width: animateProgress ? `${getProgressPercentage()}%` : '0%',
                    transition: 'width 2s ease-out'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Steps Grid - 2 Rows with Longer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`group relative bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up border-2 min-h-[320px] ${
                  completedSteps.includes(step.id) ? 'border-green-400 ring-4 ring-green-100' : 'border-gray-200'
                } ${currentStep === step.id ? 'border-yellow-400 ring-4 ring-yellow-100' : ''}`}
                style={{ 
                  animationDelay: `${index * 150}ms`
                }}
                onClick={() => handleStepClick(step)}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                     style={{ backgroundColor: step.colorScheme.primary }}>
                  {step.id}
                </div>

                {/* Completion Badge */}
                {completedSteps.includes(step.id) && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce-in">
                    <i className="bi bi-check text-white text-xs"></i>
                  </div>
                )}

                {/* Icon */}
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: step.colorScheme.accent }}
                >
                  <i className={`${step.icon} text-3xl`} style={{ color: step.colorScheme.primary }}></i>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-center mb-3" style={{ color: step.colorScheme.primary }}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed mb-6">
                  {step.subtitle}
                </p>

                {/* Progress Indicator */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    {completedSteps.includes(step.id) ? (
                      <span className="text-green-500 text-xs font-medium flex items-center">
                        <i className="bi bi-check-circle-fill mr-1"></i>
                        Completed
                      </span>
                    ) : currentStep === step.id ? (
                      <span className="text-yellow-500 text-xs font-medium flex items-center">
                        <i className="bi bi-clock mr-1"></i>
                        In Progress
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium flex items-center">
                        <i className="bi bi-circle mr-1"></i>
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: `linear-gradient(135deg, ${step.colorScheme.secondary}, ${step.colorScheme.primary})`,
                    filter: 'blur(8px)'
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Modal */}
      {isModalOpen && selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center"
                 style={{ backgroundColor: selectedStep.colorScheme.accent }}>
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: selectedStep.colorScheme.secondary }}
                >
                  <i className={`${selectedStep.icon} text-white text-xl`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: selectedStep.colorScheme.primary }}>
                    {selectedStep.title}
                  </h2>
                  <p className="text-sm text-gray-600">{selectedStep.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                <p className="text-gray-700 leading-relaxed">{selectedStep.detailedText}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <i className="bi bi-currency-pound mr-2" style={{ color: selectedStep.colorScheme.primary }}></i>
                    Cost
                  </h4>
                  <p className="text-gray-700">{selectedStep.cost}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <i className="bi bi-clock mr-2" style={{ color: selectedStep.colorScheme.primary }}></i>
                    Timeframe
                  </h4>
                  <p className="text-gray-700">{selectedStep.timeframe}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="bi bi-list-check mr-2" style={{ color: selectedStep.colorScheme.primary }}></i>
                  Requirements
                </h4>
                <ul className="space-y-2">
                  {selectedStep.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <i className="bi bi-check-circle text-green-500 mr-3"></i>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  style={{ 
                    backgroundColor: selectedStep.colorScheme.primary,
                    borderColor: selectedStep.colorScheme.primary
                  }}
                  onClick={() => {
                    if (selectedStep.actionUrl.startsWith('#')) {
                      const element = document.getElementById(selectedStep.actionUrl.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      window.open(selectedStep.actionUrl, '_blank');
                    }
                    setIsModalOpen(false);
                  }}
                >
                  <i className="bi bi-arrow-right mr-2"></i>
                  {selectedStep.actionButton}
                </Button>
                
                {!completedSteps.includes(selectedStep.id) && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      handleCompleteStep(selectedStep.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    <i className="bi bi-check-circle mr-2"></i>
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LicenseProcess;
