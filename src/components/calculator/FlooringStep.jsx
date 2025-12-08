
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { NumericInput } from "@/components/ui/numeric-input";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function FlooringStep({ formData, updateFormData }) {
  const defaultArea = {
    id: 1,
    name: "Room 1",
    type: "laminate",
    area: 9,
    subfloor: "good",
    layout: "simple",
    pattern: "straight",
    finishQuality: "standard",
    removeOld: false,
    trimDoors: 0,
    fitSkirting: false,
    wasteRemoval: false
  };

  const flooringData = formData.flooring || { areas: [defaultArea] };
  const [expandedAreas, setExpandedAreas] = useState([1]); // Updated as per outline

  useEffect(() => {
    // Updated as per outline
    if (!formData.flooring) {
      const newId = Date.now();
      updateFormData('flooring', { areas: [{ ...defaultArea, id: newId }] });
      setExpandedAreas([newId]);
    } else if (flooringData.areas.length > 0 && expandedAreas.length === 0) {
      setExpandedAreas([flooringData.areas[0].id]);
    }
  }, [formData.flooring]); // Dependency array updated as per outline

  const toggleAreaExpanded = (id) => {
    setExpandedAreas(prev => 
      prev.includes(id) ? prev.filter(areaId => areaId !== id) : [id]
    );
  };

  const updateFlooring = (areas) => {
    updateFormData('flooring', { areas });
  };

  const addArea = () => {
    const newArea = {
      ...defaultArea,
      id: Date.now(),
      name: `Room ${flooringData.areas.length + 1}`,
    };
    updateFlooring([...flooringData.areas, newArea]);
    setExpandedAreas([newArea.id]);
  };

  const removeArea = (id) => {
    if (flooringData.areas.length === 1) return;
    updateFlooring(flooringData.areas.filter(a => a.id !== id));
    setExpandedAreas(expandedAreas.filter(areaId => areaId !== id));
  };

  const updateArea = (id, field, value) => {
    const updated = flooringData.areas.map(area => 
      area.id === id ? { ...area, [field]: value } : area
    );
    updateFlooring(updated);
  };

  const getAreaSummary = (area) => {
    const type = area.type.replace('_', ' ');
    return `${type.charAt(0).toUpperCase() + type.slice(1)} • ${area.area}m² • ${area.pattern}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Flooring & Tiling
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add rooms and configure flooring requirements for each
      </p>

      <div className="space-y-3">
        {flooringData.areas.map((area) => {
          const isExpanded = expandedAreas.includes(area.id);
          
          return (
            <Card key={area.id} className="bg-[#151515] border-[#262626] overflow-hidden">
              <div 
                className="p-3 cursor-pointer hover:bg-[#262626]/50 transition-colors flex items-center justify-between touch-manipulation"
                onClick={() => toggleAreaExpanded(area.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#C8A74A]">{area.name}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#C8A74A]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#C8A74A]" />
                    )}
                  </div>
                  <p className="text-xs text-[#B8B8B8] truncate">{getAreaSummary(area)}</p>
                </div>
                {flooringData.areas.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeArea(area.id);
                    }}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 sm:h-7 sm:w-7 flex-shrink-0 ml-2 touch-manipulation"
                  >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Button>
                )}
              </div>

              {isExpanded && (
                <div className="p-3 sm:p-4 pt-0 border-t border-[#262626] space-y-3">
                  <div>
                    <Label className="text-[#F5F5F5] text-xs mb-1 block">Room Name</Label>
                    <Input
                      value={area.name}
                      onChange={(e) => updateArea(area.id, 'name', e.target.value)}
                      className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Flooring Type</Label>
                    <RadioGroup value={area.type} onValueChange={(val) => updateArea(area.id, 'type', val)}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { id: 'laminate', label: 'Laminate' },
                          { id: 'lvt', label: 'LVT' },
                          { id: 'engineered_wood', label: 'Engineered Wood' },
                          { id: 'solid_wood', label: 'Solid Wood' },
                          { id: 'carpet', label: 'Carpet' },
                          { id: 'tiles', label: 'Tiles' }
                        ].map(type => (
                          <div key={type.id} className={`border rounded-lg p-2 cursor-pointer touch-manipulation ${
                            area.type === type.id ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                          }`}>
                            <RadioGroupItem value={type.id} id={`${area.id}-${type.id}`} className="sr-only" />
                            <label htmlFor={`${area.id}-${type.id}`} className="cursor-pointer block text-center">
                              <span className={`text-xs font-medium ${area.type === type.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {type.label}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Area (m²)</Label>
                    <NumericInput
                      value={area.area}
                      onChange={(val) => updateArea(area.id, 'area', val)}
                      min={0.1}
                      max={1000}
                      step={0.1}
                      decimals={1}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Subfloor Condition</Label>
                      <Select value={area.subfloor} onValueChange={(val) => updateArea(area.id, 'subfloor', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="uneven">Uneven</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Layout Complexity</Label>
                      <Select value={area.layout} onValueChange={(val) => updateArea(area.id, 'layout', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="complex">Complex</SelectItem>
                          <SelectItem value="multiple">Multiple Rooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Pattern</Label>
                      <Select value={area.pattern} onValueChange={(val) => updateArea(area.id, 'pattern', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="straight">Straight</SelectItem>
                          <SelectItem value="diagonal">Diagonal</SelectItem>
                          <SelectItem value="herringbone">Herringbone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Finish Quality</Label>
                      <Select value={area.finishQuality} onValueChange={(val) => updateArea(area.id, 'finishQuality', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div
                      onClick={() => updateArea(area.id, 'removeOld', !area.removeOld)}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                        area.removeOld ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                      }`}
                    >
                      <Checkbox 
                        checked={area.removeOld} 
                        className={`border-white ${area.removeOld ? 'bg-[#C8A74A]' : ''}`} 
                      />
                      <span className={`text-xs font-medium ${area.removeOld ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                        Remove Old Flooring
                      </span>
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Number of Doors to Trim</Label>
                      <NumericInput
                        value={area.trimDoors}
                        onChange={(val) => updateArea(area.id, 'trimDoors', val)}
                        min={0}
                        max={50}
                      />
                    </div>

                    <div
                      onClick={() => updateArea(area.id, 'fitSkirting', !area.fitSkirting)}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                        area.fitSkirting ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                      }`}
                    >
                      <Checkbox 
                        checked={area.fitSkirting} 
                        className={`border-white ${area.fitSkirting ? 'bg-[#C8A74A]' : ''}`} 
                      />
                      <span className={`text-xs font-medium ${area.fitSkirting ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                        Fit Skirting/Beading
                      </span>
                    </div>

                    <div
                      onClick={() => updateArea(area.id, 'wasteRemoval', !area.wasteRemoval)}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                        area.wasteRemoval ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                      }`}
                    >
                      <Checkbox 
                        checked={area.wasteRemoval} 
                        className={`border-white ${area.wasteRemoval ? 'bg-[#C8A74A]' : ''}`} 
                      />
                      <div>
                        <span className={`text-xs font-medium ${area.wasteRemoval ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                          Waste Removal
                        </span>
                        <p className="text-xs text-[#B8B8B8]">Fixed £100</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        <Button
          onClick={addArea}
          variant="outline"
          className="w-full h-9 border border-[#C8A74A]/30 bg-transparent text-[#C8A74A] hover:bg-[#C8A74A]/10 gap-2 text-sm touch-manipulation min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Add Another Room
        </Button>
      </div>
    </div>
  );
}
