import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NavigationButtons({ 
  onNext, 
  onBack, 
  canProceed, 
  isFirstStep, 
  isLastStep,
  nextLabel = "Continue",
  mobile = false
}) {
  return (
    <div className={`flex gap-2 sm:gap-3 ${mobile ? 'w-full' : 'justify-between'}`}>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className={`${mobile ? 'flex-1' : ''} min-h-[44px] gap-2 border border-[#C8A74A] bg-transparent text-[#C8A74A] hover:bg-[#C8A74A]/10 active:bg-[#C8A74A]/20 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </Button>
      {!isLastStep && (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={`${mobile ? 'flex-1' : ''} min-h-[44px] bg-[#C8A74A] hover:bg-[#D8B85C] active:bg-[#D8B85C]/90 text-[#0E0E0E] gap-2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base`}
        >
          {mobile ? (nextLabel === 'Calculate Quote' ? 'Calculate' : nextLabel) : nextLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}