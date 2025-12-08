import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Bath, Package, Hammer, Paintbrush, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const services = [
  { 
    id: "kitchen", 
    label: "Kitchen", 
    icon: ChefHat,
    description: "Full installation & renovation"
  },
  { 
    id: "bathroom", 
    label: "Bathroom", 
    icon: Bath,
    description: "Fitting & tiling"
  },
  { 
    id: "flooring", 
    label: "Flooring", 
    icon: Package,
    description: "Floor installation & tiling"
  },
  { 
    id: "carpentry", 
    label: "Carpentry", 
    icon: Hammer,
    description: "Woodwork & joinery"
  },
  { 
    id: "painting", 
    label: "Painting", 
    icon: Paintbrush,
    description: "Decorating services"
  },
  { 
    id: "plastering", 
    label: "Plastering", 
    icon: Sparkles,
    description: "Wall repairs & finishing"
  }
];

export default function ServicesSelectionStep({ formData, updateFormData }) {
  const toggleService = (serviceId) => {
    const currentServices = formData.selectedServices || [];
    if (currentServices.includes(serviceId)) {
      updateFormData('selectedServices', currentServices.filter(s => s !== serviceId));
    } else {
      updateFormData('selectedServices', [...currentServices, serviceId]);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C8A74A] mb-2">
        Select Services
      </h2>
      <p className="text-sm sm:text-base text-[#B8B8B8] mb-6 sm:mb-8">
        Choose all services you need
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isSelected = formData.selectedServices?.includes(service.id);
          
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleService(service.id)}
              className={`relative p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left active:scale-95 touch-manipulation ${
                isSelected
                  ? 'border-[#C8A74A] bg-[#C8A74A]/10'
                  : 'border-[#262626] bg-[#0E0E0E] active:bg-[#151515]'
              }`}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#C8A74A]'
                    : 'bg-[#262626]'
                }`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-[#0E0E0E]' : 'text-[#B8B8B8]'}`} />
                </div>
                <Checkbox
                  checked={isSelected}
                  className={`mt-0.5 pointer-events-none ${isSelected ? 'border-[#C8A74A] bg-[#C8A74A]' : 'border-[#B8B8B8]'}`}
                />
              </div>
              <h3 className={`font-semibold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 ${
                isSelected ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
              }`}>
                {service.label}
              </h3>
              <p className={`text-xs sm:text-sm ${
                isSelected ? 'text-[#C8A74A]/70' : 'text-[#B8B8B8]'
              }`}>
                {service.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {formData.selectedServices?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <p className="text-xs sm:text-sm text-green-400">
            <span className="font-semibold">{formData.selectedServices.length}</span> service
            {formData.selectedServices.length !== 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}