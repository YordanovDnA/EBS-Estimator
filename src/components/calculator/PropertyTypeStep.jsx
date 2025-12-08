import React from "react";
import { motion } from "framer-motion";
import { Home, Building2, Building, Warehouse, HomeIcon } from "lucide-react";

const propertyTypes = [
  { id: "detached", label: "Detached", icon: Home, description: "Single family", multiplier: 1.25 },
  { id: "semi-detached", label: "Semi-Detached", icon: Building2, description: "Shared wall", multiplier: 1.15 },
  { id: "end-terrace", label: "End Terrace", icon: Building, description: "End of row", multiplier: 1.10 },
  { id: "terrace", label: "Terrace", icon: Warehouse, description: "Mid-row", multiplier: 1.00 },
  { id: "bungalow", label: "Bungalow", icon: HomeIcon, description: "Single story", multiplier: 1.10 },
  { id: "flat", label: "Flat", icon: Building2, description: "Apartment", multiplier: 0.85 }
];

export default function PropertyTypeStep({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C8A74A] mb-2">
        Property Type
      </h2>
      <p className="text-sm sm:text-base text-[#B8B8B8] mb-6 sm:mb-8">
        Select your property type
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
        {propertyTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = formData.propertyType === type.id;
          
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => updateFormData('propertyType', type.id)}
              className={`relative p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left active:scale-95 touch-manipulation ${
                isSelected
                  ? 'border-[#C8A74A] bg-[#C8A74A]/10 shadow-lg shadow-[#C8A74A]/10'
                  : 'border-[#262626] bg-[#0E0E0E] active:bg-[#151515]'
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 md:mb-4 transition-colors ${
                isSelected
                  ? 'bg-[#C8A74A]'
                  : 'bg-[#262626]'
              }`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-[#0E0E0E]' : 'text-[#B8B8B8]'}`} />
              </div>
              <h3 className={`font-semibold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 ${
                isSelected ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
              }`}>
                {type.label}
              </h3>
              <p className={`text-xs sm:text-sm ${
                isSelected ? 'text-[#C8A74A]/70' : 'text-[#B8B8B8]'
              }`}>
                {type.description}
              </p>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-[#C8A74A] rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#0E0E0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}