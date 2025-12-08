import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const additionalOptions = [
  { id: "socket", label: "Add Socket", price: 65, unit: "each" },
  { id: "radiator", label: "Move Radiator", price: 120, unit: "each" },
  { id: "skip", label: "Skip Hire (8 yd³)", price: 260, unit: "once" },
  { id: "toilet", label: "Builder's Toilet", price: 40, unit: "per week" },
  { id: "protection", label: "Site Protection", price: 90, unit: "average" },
  { id: "cleaning", label: "Deep Cleaning", price: 115, unit: "average" }
];

export default function AdditionalsStep({ formData, updateFormData }) {
  const additionalsData = formData.additionals || [];

  const toggleAdditional = (id) => {
    const exists = additionalsData.find(a => a.id === id);
    if (exists) {
      updateFormData('additionals', additionalsData.filter(a => a.id !== id));
    } else {
      const option = additionalOptions.find(o => o.id === id);
      updateFormData('additionals', [...additionalsData, { id, quantity: 1, price: option.price }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    updateFormData('additionals', additionalsData.map(a => 
      a.id === id ? { ...a, quantity: Math.max(1, quantity) } : a
    ));
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C8A74A] mb-2">
        Additional Services <span className="text-sm sm:text-base text-[#B8B8B8] font-normal">(Optional)</span>
      </h2>
      <p className="text-sm sm:text-base text-[#B8B8B8] mb-6 sm:mb-8">
        Optional extras for your project
      </p>

      <div className="space-y-3 sm:space-y-4">
        {additionalOptions.map(option => {
          const selected = additionalsData.find(a => a.id === option.id);
          return (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-3 sm:p-4 transition-all ${
                selected ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div
                  className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleAdditional(option.id)}
                >
                  <Checkbox
                    checked={!!selected}
                    className={`flex-shrink-0 ${selected ? 'border-[#C8A74A] bg-[#C8A74A]' : 'border-[#B8B8B8]'}`}
                  />
                  <div>
                    <span className={`font-medium block text-sm sm:text-base ${selected ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                      {option.label}
                    </span>
                    <p className="text-xs sm:text-sm text-[#B8B8B8]">
                      £{option.price} {option.unit}
                    </p>
                  </div>
                </div>

                {selected && (
                  <div className="w-20 sm:w-24">
                    <Label htmlFor={`qty-${option.id}`} className="text-xs text-[#B8B8B8] block mb-1">
                      Quantity
                    </Label>
                    <Input
                      id={`qty-${option.id}`}
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={selected.quantity}
                      onChange={(e) => updateQuantity(option.id, parseInt(e.target.value) || 1)}
                      className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 sm:h-10 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {additionalsData.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-xs sm:text-sm text-green-400">
            <span className="font-semibold">
              {additionalsData.length}
            </span> additional service{additionalsData.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}