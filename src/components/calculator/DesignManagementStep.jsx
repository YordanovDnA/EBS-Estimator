import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const designOptions = [
  { 
    id: "none", 
    label: "None", 
    description: "No additional services", 
    percentage: 0 
  },
  { 
    id: "procurement", 
    label: "Procurement", 
    description: "Organise materials supply", 
    percentage: 7 
  },
  { 
    id: "management_procurement", 
    label: "Management & Procurement", 
    description: "Manage sub-contractors + organise materials supply", 
    percentage: 11 
  },
  { 
    id: "full", 
    label: "Design, Management & Procurement", 
    description: "Design and manage all aspects of the workflow", 
    percentage: 12 
  }
];

export default function DesignManagementStep({ formData, updateFormData }) {
  const designData = formData.designManagement || "none";

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C8A74A] mb-2">
        Design & Project Management <span className="text-sm sm:text-base text-[#B8B8B8] font-normal">(Optional)</span>
      </h2>
      <p className="text-sm sm:text-base text-[#B8B8B8] mb-6 sm:mb-8">
        Optional design and management services
      </p>

      <RadioGroup value={designData} onValueChange={(val) => updateFormData('designManagement', val)}>
        <div className="space-y-3 sm:space-y-4">
          {designOptions.map(option => (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-4 sm:p-5 cursor-pointer transition-all active:scale-[0.99] touch-manipulation ${
                designData === option.id ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E] active:bg-[#151515]'
              }`}
            >
              <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
              <label htmlFor={option.id} className="cursor-pointer block">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-base sm:text-lg mb-1 ${
                      designData === option.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
                    }`}>
                      {option.label}
                    </h3>
                    <p className={`text-xs sm:text-sm ${
                      designData === option.id ? 'text-[#C8A74A]/70' : 'text-[#B8B8B8]'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                  {option.percentage > 0 && (
                    <div className={`text-right flex-shrink-0 ${
                      designData === option.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
                    }`}>
                      <span className="text-xl sm:text-2xl font-bold">{option.percentage}%</span>
                      <p className="text-xs text-[#B8B8B8] mt-0.5 sm:mt-1">of total</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}