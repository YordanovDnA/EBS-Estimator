
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const worktopTypes = [
  { id: "laminate", label: "Laminate", multiplier: 1.00 },
  { id: "solid_wood", label: "Solid Wood", multiplier: 1.10 },
  { id: "quartz", label: "Quartz", multiplier: 1.15 },
  { id: "granite", label: "Granite", multiplier: 1.20 },
  { id: "marble", label: "Marble", multiplier: 1.25 }
];

const electricsOptions = [
  { id: "oven", label: "Oven" },
  { id: "downlights", label: "Downlights" },
  { id: "cooker_hood", label: "Cooker Hood" },
  { id: "extra_sockets", label: "Extra Sockets" }
];

const plumbingOptions = [
  { id: "sink", label: "Sink" },
  { id: "dishwasher", label: "Dishwasher" },
  { id: "washing_machine", label: "Washing Machine" },
  { id: "radiator", label: "Radiator" }
];

export default function KitchenStep({ formData, updateFormData }) {
  const defaultArea = {
    id: 1,
    name: "Room 1",
    size: "medium",
    worktop: "laminate",
    requireElectricalAlterations: false,
    electrics: [],
    requirePlumbingAlterations: false,
    plumbing: [],
    splashback: false,
    requireFloorTiling: false,
    floorTilingArea: 0
  };

  const kitchenData = formData.kitchen || { areas: [defaultArea] };
  const [expandedAreas, setExpandedAreas] = useState([1]); // Initial state set to expand area with ID 1

  useEffect(() => {
    // If formData.kitchen is not present at all, initialize it with a new area
    // and ensure that new area is expanded.
    if (!formData.kitchen) {
      const newId = Date.now();
      updateFormData('kitchen', { areas: [{ ...defaultArea, id: newId }] });
      setExpandedAreas([newId]);
    } 
    // If formData.kitchen exists and has areas, but nothing is currently expanded,
    // expand the first available area.
    // This condition handles cases where expandedAreas might have been cleared
    // or if the initial `useState([1])` does not match any valid area ID after loading existing data,
    // leading to `expandedAreas` potentially becoming empty through other component logic.
    else if (kitchenData.areas.length > 0 && expandedAreas.length === 0) {
      setExpandedAreas([kitchenData.areas[0].id]);
    }
  }, [formData.kitchen, updateFormData, defaultArea, kitchenData.areas, expandedAreas.length]);

  const toggleAreaExpanded = (id) => {
    setExpandedAreas(prev => 
      prev.includes(id) ? prev.filter(areaId => areaId !== id) : [id]
    );
  };

  const updateKitchen = (areas) => {
    updateFormData('kitchen', { areas });
  };

  const addArea = () => {
    const newArea = {
      ...defaultArea,
      id: Date.now(),
      name: `Room ${kitchenData.areas.length + 1}`,
    };
    const updatedAreas = [...kitchenData.areas, newArea];
    updateKitchen(updatedAreas);
    setExpandedAreas([newArea.id]);
  };

  const removeArea = (id) => {
    if (kitchenData.areas.length === 1) return;
    updateKitchen(kitchenData.areas.filter(a => a.id !== id));
    setExpandedAreas(expandedAreas.filter(areaId => areaId !== id));
  };

  const updateArea = (id, field, value) => {
    const updated = kitchenData.areas.map(area => 
      area.id === id ? { ...area, [field]: value } : area
    );
    updateKitchen(updated);
  };

  const toggleElectrics = (id, item) => {
    const area = kitchenData.areas.find(a => a.id === id);
    const current = area.electrics || [];
    if (current.includes(item)) {
      updateArea(id, 'electrics', current.filter(i => i !== item));
    } else {
      updateArea(id, 'electrics', [...current, item]);
    }
  };

  const togglePlumbing = (id, item) => {
    const area = kitchenData.areas.find(a => a.id === id);
    const current = area.plumbing || [];
    if (current.includes(item)) {
      updateArea(id, 'plumbing', current.filter(i => i !== item));
    } else {
      updateArea(id, 'plumbing', [...current, item]);
    }
  };

  const getAreaSummary = (area) => {
    const size = area.size.charAt(0).toUpperCase() + area.size.slice(1);
    const worktop = area.worktop.replace('_', ' ');
    const extras = [];
    if (area.requireElectricalAlterations && area.electrics?.length > 0) extras.push('electrical');
    if (area.requirePlumbingAlterations && area.plumbing?.length > 0) extras.push('plumbing');
    if (area.splashback) extras.push('splashback');
    if (area.requireFloorTiling && area.floorTilingArea > 0) extras.push(`${area.floorTilingArea}m² tiling`);
    return `${size} • ${worktop}${extras.length > 0 ? ' • ' + extras.join(', ') : ''}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Kitchen Details
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add kitchen areas and configure requirements for each
      </p>

      <div className="space-y-3">
        {kitchenData.areas.map((area) => {
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
                {kitchenData.areas.length > 1 && (
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
                    <Label className="text-[#F5F5F5] text-xs mb-1 block">Area Name</Label>
                    <Input
                      value={area.name}
                      onChange={(e) => updateArea(area.id, 'name', e.target.value)}
                      className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Kitchen Size</Label>
                    <RadioGroup value={area.size} onValueChange={(val) => updateArea(area.id, 'size', val)}>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map(size => (
                          <div key={size} className={`border rounded-lg p-2 cursor-pointer touch-manipulation ${
                            area.size === size ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                          }`}>
                            <RadioGroupItem value={size} id={`${area.id}-${size}`} className="sr-only" />
                            <label htmlFor={`${area.id}-${size}`} className="cursor-pointer block text-center">
                              <span className={`text-xs font-medium capitalize ${area.size === size ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {size}
                              </span>
                              <p className={`text-xs mt-0.5 ${area.size === size ? 'text-[#C8A74A]/70' : 'text-[#B8B8B8]'}`}>
                                {size === 'small' ? '4-7 units' : size === 'medium' ? '8-12 units' : '13+ units'}
                              </p>
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Worktop */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Worktop Type</Label>
                    <RadioGroup value={area.worktop} onValueChange={(val) => updateArea(area.id, 'worktop', val)}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {worktopTypes.map(type => (
                          <div key={type.id} className={`border rounded-lg p-2 cursor-pointer touch-manipulation ${
                            area.worktop === type.id ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                          }`}>
                            <RadioGroupItem value={type.id} id={`${area.id}-${type.id}`} className="sr-only" />
                            <label htmlFor={`${area.id}-${type.id}`} className="cursor-pointer block text-center">
                              <span className={`text-xs font-medium ${area.worktop === type.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {type.label}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Electrical Alterations - Conditional */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">
                      Electrical alterations required? <span className="text-xs text-[#B8B8B8] font-normal">(Optional)</span>
                    </Label>
                    <p className="text-xs text-[#B8B8B8] mb-2">
                      Connections for standard appliances are automatically included. Use this only if existing electrical points require alteration.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateArea(area.id, 'requireElectricalAlterations', false)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          !area.requireElectricalAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={() => updateArea(area.id, 'requireElectricalAlterations', true)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          area.requireElectricalAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        Yes
                      </button>
                    </div>

                    {area.requireElectricalAlterations && (
                      <div className="mt-3 p-3 bg-[#0E0E0E] border border-[#C8A74A]/30 rounded-lg space-y-2">
                        <Label className="text-[#C8A74A] text-xs font-medium block">Select alterations needed</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {electricsOptions.map(option => (
                            <div
                              key={option.id}
                              onClick={() => toggleElectrics(area.id, option.id)}
                              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                                area.electrics?.includes(option.id) ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                              }`}
                            >
                              <Checkbox
                                checked={area.electrics?.includes(option.id)}
                                className={`border-white ${area.electrics?.includes(option.id) ? 'bg-[#C8A74A]' : ''}`}
                              />
                              <span className={`text-xs ${area.electrics?.includes(option.id) ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Plumbing Alterations - Conditional */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">
                      Plumbing alterations required? <span className="text-xs text-[#B8B8B8] font-normal">(Optional)</span>
                    </Label>
                    <p className="text-xs text-[#B8B8B8] mb-2">
                      Connections for standard appliances and plumbing are automatically included. Use this only if existing plumbing points require alteration.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateArea(area.id, 'requirePlumbingAlterations', false)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          !area.requirePlumbingAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={() => updateArea(area.id, 'requirePlumbingAlterations', true)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          area.requirePlumbingAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        Yes
                      </button>
                    </div>

                    {area.requirePlumbingAlterations && (
                      <div className="mt-3 p-3 bg-[#0E0E0E] border border-[#C8A74A]/30 rounded-lg space-y-2">
                        <Label className="text-[#C8A74A] text-xs font-medium block">Select alterations needed</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {plumbingOptions.map(option => (
                            <div
                              key={option.id}
                              onClick={() => togglePlumbing(area.id, option.id)}
                              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                                area.plumbing?.includes(option.id) ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                              }`}
                            >
                              <Checkbox
                                checked={area.plumbing?.includes(option.id)}
                                className={`border-white ${area.plumbing?.includes(option.id) ? 'bg-[#C8A74A]' : ''}`}
                              />
                              <span className={`text-xs ${area.plumbing?.includes(option.id) ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Splashback */}
                  <div
                    onClick={() => updateArea(area.id, 'splashback', !area.splashback)}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                      area.splashback ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                    }`}
                  >
                    <Checkbox
                      checked={area.splashback}
                      className={`border-white ${area.splashback ? 'bg-[#C8A74A]' : ''}`}
                    />
                    <span className={`text-xs font-medium ${area.splashback ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                      Splashback Tiling
                    </span>
                  </div>

                  {/* Floor Tiling - Conditional */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">
                      Floor tiling required? <span className="text-xs text-[#B8B8B8] font-normal">(Optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateArea(area.id, 'requireFloorTiling', false)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          !area.requireFloorTiling
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={() => updateArea(area.id, 'requireFloorTiling', true)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          area.requireFloorTiling
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        Yes
                      </button>
                    </div>

                    {area.requireFloorTiling && (
                      <div className="mt-3">
                        <Label className="text-[#F5F5F5] text-xs mb-1 block">Floor Tiling Area (m²)</Label>
                        <NumericInput
                          value={area.floorTilingArea}
                          onChange={(val) => updateArea(area.id, 'floorTilingArea', val)}
                          min={0}
                          max={100}
                          step={0.1}
                          decimals={1}
                        />
                      </div>
                    )}
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
          Add Another Kitchen Area
        </Button>
      </div>
    </div>
  );
}
