import React from "react";
import { motion } from "framer-motion";
import { Home, Building, Building2 } from "lucide-react";

const propertySizes = [
  { 
    id: "small", 
    label: "Small", 
    range: "4-7 units",
    icon: Home,
    description: "Perfect for starter projects",
    multiplier: 1
  },
  { 
    id: "medium", 
    label: "Medium", 
    range: "8-12 units",
    icon: Building,
    description: "Mid-size development",
    multiplier: 1.5
  },
  { 
    id: "large", 
    label: "Large", 
    range: "13+ units",
    icon: Building2,
    description: "Large scale project",
    multiplier: 2.2
  }
];

export default function PropertySizeStep({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        What's the project size?
      </h2>
      <p className="text-slate-600 mb-8">
        Choose the scale that matches your development
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {propertySizes.map((size, index) => {
          const Icon = size.icon;
          const isSelected = formData.propertySize === size.id;
          
          return (
            <motion.button
              key={size.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => updateFormData('propertySize', size.id)}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-center group hover:shadow-xl ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:scale-102'
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all ${
                isSelected
                  ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
                  : 'bg-slate-100 group-hover:bg-slate-200'
              }`}>
                <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <h3 className={`font-bold text-xl mb-1 ${
                isSelected ? 'text-orange-900' : 'text-slate-900'
              }`}>
                {size.label}
              </h3>
              <p className={`text-2xl font-bold mb-2 ${
                isSelected ? 'text-orange-600' : 'text-slate-600'
              }`}>
                {size.range}
              </p>
              <p className={`text-sm ${
                isSelected ? 'text-orange-700' : 'text-slate-600'
              }`}>
                {size.description}
              </p>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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