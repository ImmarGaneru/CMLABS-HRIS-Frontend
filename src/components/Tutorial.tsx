'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TutorialProps {
  className?: string;
  steps: TutorialStep[];
  storageKey?: string;
  buttonPosition?: 'bottom-right' | 'top-right' | 'top-left' | 'bottom-left';
  buttonVariant?: 'floating' | 'inline';
}

interface TutorialStep {
  target: string;
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
}

const Tutorial = ({ 
  className, 
  steps, 
  storageKey = 'defaultTutorialCompleted',
  buttonPosition = 'bottom-right',
  buttonVariant = 'floating'
}: TutorialProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTutorial = () => {
    setIsOpen(true);
    setCurrentStep(0);
  };

  const closeTutorial = () => {
    setIsOpen(false);
    sessionStorage.setItem(storageKey, 'true');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const tutorialCompleted = sessionStorage.getItem(storageKey);
    if (!tutorialCompleted) {
      setIsOpen(true);
    }
  }, [storageKey]);

  const getButtonPositionClass = () => {
    switch (buttonPosition) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const TutorialButton = () => (
    <Button
      variant={buttonVariant === 'floating' ? 'ghost' : 'outline'}
      size="icon"
      className={`${buttonVariant === 'floating' ? 'fixed' : ''} ${getButtonPositionClass()} z-50 hover:bg-blue-100 transition-colors`}
      onClick={startTutorial}
      aria-label="Start Tutorial"
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );

  if (!isOpen) {
    return <TutorialButton />;
  }

  const currentStepData = steps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);

  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const tooltipStyle = {
    position: 'fixed' as const,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    maxWidth: '300px',
    ...getTooltipPosition(rect, currentStepData.placement),
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeTutorial}
      />
      <div style={tooltipStyle} className="z-50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">Tutorial</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={closeTutorial}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">{currentStepData.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={nextStep}
            className="flex items-center gap-1"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
};

function getTooltipPosition(rect: DOMRect, placement: string) {
  const margin = 10;
  switch (placement) {
    case 'top':
      return {
        top: rect.top - margin,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + margin,
        transform: 'translateY(-50%)',
      };
    case 'bottom':
      return {
        top: rect.bottom + margin,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, 0)',
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - margin,
        transform: 'translate(-100%, -50%)',
      };
    default:
      return {};
  }
}

export default Tutorial; 