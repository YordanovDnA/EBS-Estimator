
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function PlasteringStep({ formData, updateFormData }) {
  const defaultArea = {
    id: 1,
    name: "Room 1",
    workType: "reskim",
    area: 36,
    patchCount: 0,
    surfaceCondition: "good",
    finishLevel: "standard",
    access: "easy"
  };

  // plasteringData will either be the existing data from formData, or a default structure
  // If formData.plastering is null/undefined, it defaults to an object with `areas` containing the `defaultArea` (which has id: 1)
  const plasteringData = formData.plastering || { areas: [defaultArea] };

  // Initialize expandedAreas.
  // If formData.plastering exists and has areas, expand the first one.
  // Otherwise, if formData.plastering is null, default to expanding area with id 1 (which is the defaultArea's ID initially).
  const [expandedAreas, setExpandedAreas] = useState(() => {
    if (formData.plastering && formData.plastering.areas && formData.plastering.areas.length > 0) {
      return [formData.plastering.areas[0].id];
    }
    return [1]; // Default to expanding area with ID 1 if no existing data, as specified in the outline's useState([1])
  });

  useEffect(() => {
    // This effect runs on mount and whenever formData.plastering changes.
    if (!formData.plastering) {
      // If formData.plastering is null, it means we need to initialize it.
      const newId = Date.now(); // Generate a unique ID for the new default area
      updateFormData('plastering', { areas: [{ ...defaultArea, id: newId }] });
      // Also, set the expanded area to this newly created area's ID
      setExpandedAreas([newId]);
    } else if (plasteringData.areas.length > 0 && expandedAreas.length === 0) {
      // If formData.plastering exists and has areas, but nothing is currently expanded,
      // expand the first area from the existing data.
      setExpandedAreas([plasteringData.areas[0].id]);
    }
  }, [formData.plastering]); // Rerun effect when formData.plastering object reference changes

  const toggleAreaExpanded = (id) => {
    setExpandedAreas(prev => 
      prev.includes(id) ? prev.filter(areaId => areaId !== id) : [id]
    );
  };

  const updatePlastering = (areas) => {
    updateFormData('plastering', { areas });
  };

  const addArea = () => {
    const newArea = {
      ...defaultArea,
      id: Date.now(),
      name: `Room ${plasteringData.areas.length + 1}`,
    };
    updatePlastering([...plasteringData.areas, newArea]);
    setExpandedAreas([newArea.id]);
  };

  const removeArea = (id) => {
    if (plasteringData.areas.length === 1) return;
    updatePlastering(plasteringData.areas.filter(a => a.id !== id));
    setExpandedAreas(expandedAreas.filter(areaId => areaId !== id));
  };

  const updateArea = (id, field, value) => {
    const updated = plasteringData.areas.map(area => 
      area.id === id ? { ...area, [field]: value } : area
    );
    updatePlastering(updated);
  };

  const getAreaSummary = (area) => {
    const workTypeLabel = {
      reskim: 'Reskim',
      patch: 'Patch Work',
      reboard: 'Reboard & Skim',
      artex: 'Artex Removal'
    }[area.workType];
    
    const size = area.workType === 'patch' 
      ? `${area.patchCount} patches` 
      : `${area.area}m²`;
    
    return `${workTypeLabel} • ${size}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Plastering & Patching
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add rooms and configure plastering requirements for each
      </p>

      <div className="space-y-3">
        {plasteringData.areas.map((area) => {
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
                {plasteringData.areas.length > 1 && (
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
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Work Type</Label>
                    <RadioGroup value={area.workType} onValueChange={(val) => updateArea(area.id, 'workType', val)}>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'reskim', label: 'Reskim' },
                          { id: 'patch', label: 'Patch Work' },
                          { id: 'reboard', label: 'Reboard & Skim' },
                          { id: 'artex', label: 'Artex Removal' }
                        ].map(type => (
                          <div key={type.id} className={`border rounded-lg p-2 cursor-pointer touch-manipulation ${
                            area.workType === type.id ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                          }`}>
                            <RadioGroupItem value={type.id} id={`${area.id}-${type.id}`} className="sr-only" />
                            <label htmlFor={`${area.id}-${type.id}`} className="cursor-pointer block text-center">
                              <span className={`text-xs font-medium ${area.workType === type.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {type.label}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    {area.workType === 'patch' ? (
                      <div>
                        <Label className="text-[#F5F5F5] text-sm mb-2 block">Number of Patches</Label>
                        <NumericInput
                          value={area.patchCount || 1}
                          onChange={(val) => updateArea(area.id, 'patchCount', val)}
                          min={1}
                          max={100}
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-[#F5F5F5] text-sm mb-2 block">Total Area (m²)</Label>
                        <NumericInput
                          value={area.area}
                          onChange={(val) => updateArea(area.id, 'area', val)}
                          min={0.1}
                          max={1000}
                          step={0.1}
                          decimals={1}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Surface Condition</Label>
                      <Select value={area.surfaceCondition} onValueChange={(val) => updateArea(area.id, 'surfaceCondition', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Finish Level</Label>
                      <Select value={area.finishLevel} onValueChange={(val) => updateArea(area.id, 'finishLevel', val)}>
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

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Site Access</Label>
                    <Select value={area.access} onValueChange={(val) => updateArea(area.id, 'access', val)}>
                      <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="stairs">Stairs only</SelectItem>
                        <SelectItem value="no_parking">No parking</SelectItem>
                      </SelectContent>
                    </Select>
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
