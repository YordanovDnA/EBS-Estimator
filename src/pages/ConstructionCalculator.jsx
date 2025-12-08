import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Building2, CheckCircle2 } from "lucide-react";

import PropertyTypeStep from "../components/calculator/PropertyTypeStep";
import ServicesSelectionStep from "../components/calculator/ServicesSelectionStep";
import KitchenStep from "../components/calculator/KitchenStep";
import BathroomStep from "../components/calculator/BathroomStep";
import FlooringStep from "../components/calculator/FlooringStep";
import CarpentryStep from "../components/calculator/CarpentryStep";
import PaintingStep from "../components/calculator/PaintingStep";
import PlasteringStep from "../components/calculator/PlasteringStep";
import MaterialsStep from "../components/calculator/MaterialsStep";
import AdditionalsStep from "../components/calculator/AdditionalsStep";
import DesignManagementStep from "../components/calculator/DesignManagementStep";
import FinalQuoteStep from "../components/calculator/FinalQuoteStep";
import NavigationButtons from "../components/calculator/NavigationButtons";

export default function ConstructionCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    propertyType: null,
    selectedServices: [],
    kitchen: null,
    bathroom: null,
    flooring: null,
    carpentry: null,
    painting: null,
    plastering: null,
    materials: null,
    additionals: [],
    designManagement: null
  });

  const baseSteps = [
    { id: "services", title: "Services", component: ServicesSelectionStep },
    { id: "property", title: "Property", component: PropertyTypeStep }
  ];

  const serviceSteps = [];
  if (formData.selectedServices.includes('kitchen')) {
    serviceSteps.push({ id: "kitchen", title: "Kitchen", component: KitchenStep });
  }
  if (formData.selectedServices.includes('bathroom')) {
    serviceSteps.push({ id: "bathroom", title: "Bathroom", component: BathroomStep });
  }
  if (formData.selectedServices.includes('flooring')) {
    serviceSteps.push({ id: "flooring", title: "Flooring", component: FlooringStep });
  }
  if (formData.selectedServices.includes('carpentry')) {
    serviceSteps.push({ id: "carpentry", title: "Carpentry", component: CarpentryStep });
  }
  if (formData.selectedServices.includes('painting')) {
    serviceSteps.push({ id: "painting", title: "Painting", component: PaintingStep });
  }
  if (formData.selectedServices.includes('plastering')) {
    serviceSteps.push({ id: "plastering", title: "Plastering", component: PlasteringStep });
  }

  const finalSteps = [
    { id: "additionals", title: "Extras", component: AdditionalsStep },
    { id: "materials", title: "Materials", component: MaterialsStep },
    { id: "design", title: "Design", component: DesignManagementStep },
    { id: "quote", title: "Quote", component: FinalQuoteStep }
  ];

  const steps = [...baseSteps, ...serviceSteps, ...finalSteps];

  useEffect(() => {
    if (contentRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    if (index <= currentStep) {
      setCurrentStep(index);
    }
  };

  const canProceed = () => {
    const currentStepId = steps[currentStep].id;
    
    switch (currentStepId) {
      case "services":
        return formData.selectedServices.length > 0;
      case "property":
        return formData.propertyType !== null;
      default:
        return true;
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pb-20 md:pb-12 overflow-x-hidden" ref={contentRef}>
      {/* Mobile-Optimized Header */}
      <header className="bg-[#151515] border-b border-[#262626] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#C8A74A] rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E0E0E]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-[#C8A74A] truncate">EBS Estimator</h1>
                <p className="text-xs text-[#B8B8B8] hidden sm:block">Exceptional Building Services</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B8B8B8] bg-[#0E0E0E] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#262626]">
              <span className="font-medium text-[#F5F5F5]">{currentStep + 1}</span>
              <span className="text-[#C8A74A] hidden sm:inline">of</span>
              <span className="text-[#F5F5F5] sm:inline">/</span>
              <span className="text-[#F5F5F5]">{steps.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-Optimized Progress Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-6">
        <div className="mb-3 sm:mb-6">
          <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
            <div className="flex justify-between items-center mb-2 min-w-max sm:min-w-0">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => goToStep(index)}
                      disabled={index > currentStep}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 touch-manipulation ${
                        index < currentStep
                          ? 'bg-green-600 text-white cursor-pointer active:bg-green-700'
                          : index === currentStep
                          ? 'bg-[#C8A74A] text-[#0E0E0E] ring-2 ring-[#C8A74A]/30'
                          : 'bg-[#262626] text-[#B8B8B8] cursor-not-allowed'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        index + 1
                      )}
                    </button>
                    <span className={`text-[10px] sm:text-xs mt-1 text-center whitespace-nowrap px-1 ${
                      index === currentStep ? 'text-[#C8A74A] font-medium' : 'text-[#B8B8B8]'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1.5 sm:mx-2 min-w-[20px] sm:min-w-[30px]">
                      <div className="h-full bg-[#262626] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            index < currentStep ? 'bg-green-600 w-full' : 'bg-[#262626] w-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation - Under Progress Bar */}
      {!isLastStep && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-3">
          <NavigationButtons
            onNext={nextStep}
            onBack={prevStep}
            canProceed={canProceed()}
            isFirstStep={currentStep === 0}
            isLastStep={isLastStep}
            nextLabel={currentStep === steps.length - 2 ? 'Calculate' : 'Continue'}
            mobile={false}
          />
        </div>
      )}

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-3 sm:pb-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-[#151515] border border-[#262626] shadow-none overflow-hidden rounded-lg sm:rounded-xl">
              <div className="p-3 sm:p-4 md:p-6">
                <CurrentStepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation for Mobile */}
      {!isLastStep && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-[#262626] px-3 sm:px-4 py-3 z-40 md:hidden safe-area-bottom">
          <NavigationButtons
            onNext={nextStep}
            onBack={prevStep}
            canProceed={canProceed()}
            isFirstStep={currentStep === 0}
            isLastStep={isLastStep}
            nextLabel={currentStep === steps.length - 2 ? 'Calculate' : 'Continue'}
            mobile={true}
          />
        </div>
      )}

      {/* Desktop Bottom Navigation */}
      {!isLastStep && (
        <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-[#151515]/95 backdrop-blur-sm border-t border-[#262626] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <NavigationButtons
              onNext={nextStep}
              onBack={prevStep}
              canProceed={canProceed()}
              isFirstStep={currentStep === 0}
              isLastStep={isLastStep}
              nextLabel={currentStep === steps.length - 2 ? 'Calculate Quote' : 'Continue'}
              mobile={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}