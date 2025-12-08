import React from "react";
import { motion } from "framer-motion";
import { Zap, Droplet, Wifi, ShieldCheck, Thermometer, Wind } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const additionalServices = [
  { 
    id: "electrical", 
    label: "Electrical Alterations", 
    icon: Zap,
    description: "Rewiring, new circuits, lighting",
    basePrice: 3200
  },
  { 
    id: "plumbing", 
    label: "Plumbing Alterations", 
    icon: Droplet,
    description: "Pipe work, drainage, fixtures",
    basePrice: 2800
  },
  { 
    id: "networking", 
    label: "Network & Data Cabling", 
    icon: Wifi,
    description: "Ethernet, fiber, smart home",
    basePrice: 1500
  },
  { 
    id: "security", 
    label: "Security Systems", 
    icon: ShieldCheck,
    description: "CCTV, alarms, access control",
    basePrice: 2500
  },
  { 
    id: "heating", 
    label: "Heating & Boiler", 
    icon: Thermometer,
    description: "Central heating, boiler installation",
    basePrice: 4500
  },
  { 
    id: "ventilation", 
    label: "Ventilation Systems", 
    icon: Wind,
    description: "HVAC, extraction, air quality",
    basePrice: 2200
  }
];

export default function AdditionalServicesStep({ formData, updateFormData }) {
  const toggleService = (serviceId) => {
    const currentServices = formData.additionalServices || [];
    if (currentServices.includes(serviceId)) {
      updateFormData('additionalServices', currentServices.filter(s => s !== serviceId));
    } else {
      updateFormData('additionalServices', [...currentServices, serviceId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Any additional services?
      </h2>
      <p className="text-slate-600 mb-8">
        Optional services to enhance your project (you can skip this step)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {additionalServices.map((service, index) => {
          const Icon = service.icon;
          const isSelected = formData.additionalServices?.includes(service.id);
          
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleService(service.id)}
              className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left group hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-blue-500'
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                </div>
                <Checkbox
                  checked={isSelected}
                  className={`${isSelected ? 'border-blue-500' : ''}`}
                />
              </div>
              <h3 className={`font-semibold text-base mb-1 ${
                isSelected ? 'text-blue-900' : 'text-slate-900'
              }`}>
                {service.label}
              </h3>
              <p className={`text-xs mb-2 ${
                isSelected ? 'text-blue-700' : 'text-slate-600'
              }`}>
                {service.description}
              </p>
              <p className={`text-sm font-semibold ${
                isSelected ? 'text-blue-600' : 'text-slate-500'
              }`}>
                +£{service.basePrice.toLocaleString()}
              </p>
            </motion.button>
          );
        })}
      </div>

      {formData.additionalServices?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{formData.additionalServices.length}</span> additional service
            {formData.additionalServices.length !== 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}