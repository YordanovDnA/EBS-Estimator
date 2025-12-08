import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

export function NumericInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 999999,
  step = 1,
  decimals = 0,
  className = "",
  disabled = false 
}) {
  const handleIncrement = () => {
    const newValue = Math.min(max, parseFloat(value || 0) + step);
    onChange(decimals > 0 ? parseFloat(newValue.toFixed(decimals)) : Math.round(newValue));
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, parseFloat(value || 0) - step);
    onChange(decimals > 0 ? parseFloat(newValue.toFixed(decimals)) : Math.round(newValue));
  };

  const handleChange = (e) => {
    let val = e.target.value;
    
    // Replace comma with dot for decimal separator
    val = val.replace(',', '.');
    
    if (val === '' || val === '.') {
      onChange(min);
      return;
    }
    
    // Only allow numbers and single dot
    if (!/^[0-9]*\.?[0-9]*$/.test(val)) return;
    
    let num = parseFloat(val);
    if (isNaN(num)) return;
    
    num = Math.max(min, Math.min(max, num));
    
    if (decimals > 0) {
      onChange(parseFloat(num.toFixed(decimals)));
    } else {
      onChange(Math.round(num));
    }
  };

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || parseFloat(value || 0) <= min}
        className="h-10 w-10 sm:h-11 sm:w-11 min-h-[44px] min-w-[44px] bg-[#151515] border-[#C8A74A]/50 hover:bg-[#C8A74A]/20 hover:border-[#C8A74A] active:bg-[#C8A74A]/30 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation flex-shrink-0 text-[#C8A74A]"
      >
        <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Input
        type="text"
        inputMode="decimal"
        value={value || min}
        onChange={handleChange}
        disabled={disabled}
        className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] text-center min-h-[44px] h-10 sm:h-11 text-base sm:text-lg font-medium flex-1 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
        placeholder={`${min}`}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || parseFloat(value || 0) >= max}
        className="h-10 w-10 sm:h-11 sm:w-11 min-h-[44px] min-w-[44px] bg-[#151515] border-[#C8A74A]/50 hover:bg-[#C8A74A]/20 hover:border-[#C8A74A] active:bg-[#C8A74A]/30 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation flex-shrink-0 text-[#C8A74A]"
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
}