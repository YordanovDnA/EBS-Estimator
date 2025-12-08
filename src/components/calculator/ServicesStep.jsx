import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Bath, Hammer, Paintbrush, Lightbulb } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const services = [
  { 
    id: "kitchen", 
    label: "Kitchen", 
    icon: ChefHat,
    description: "Full kitchen installation & renovation",
    basePrice: 8500
  },
  { 
    id: "bathroom", 
    label: "Bathroom", 
    icon: Bath,
    description: "Bathroom fitting & tiling",
    basePrice: 6500
  },
  { 
    id: "carpentry", 
    label: "Carpentry & Joinery", 
    icon: Hammer,
    description: "Custom woodwork & installations",
    basePrice: 5500
  },
  { 
    id: "painting", 
    label: "Painting & Decorating", 
    icon: Paintbrush,
    description: "Interior & exterior painting",
    basePrice: 3500
  },
  { 
    id: "design", 
    label: "Design & Management", 
    icon: Lightbulb,
    description: "Project planning & oversight",
    basePrice: 7500
  }
];

export default function ServicesStep({ formData, updateFormData }) {
  const toggleService = (serviceId) => {
    const currentServices = formData.services || [];
    if (currentServices.includes(serviceId)) {
      updateFormData('services', currentServices.filter(s => s !== serviceId));
    } else {
      updateFormData('services', [...currentServices, serviceId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Which services do you need?
      </h2>
      <p className="text-slate-600 mb-8">
        Select all the services you require for your project
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isSelected = formData.services?.includes(service.id);
          
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleService(service.id)}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left group hover:shadow-md ${
                isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-orange-500'
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-1 ${
                    isSelected ? 'text-orange-900' : 'text-slate-900'
                  }`}>
                    {service.label}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    isSelected ? 'text-orange-700' : 'text-slate-600'
                  }`}>
                    {service.description}
                  </p>
                  <p className={`text-sm font-semibold ${
                    isSelected ? 'text-orange-600' : 'text-slate-500'
                  }`}>
                    From £{service.basePrice.toLocaleString()}
                  </p>
                </div>
                <Checkbox
                  checked={isSelected}
                  className={`mt-1 ${isSelected ? 'border-orange-500' : ''}`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {formData.services?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-sm text-green-800">
            <span className="font-semibold">{formData.services.length}</span> service
            {formData.services.length !== 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}