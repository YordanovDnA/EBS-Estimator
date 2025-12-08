
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function CarpentryStep({ formData, updateFormData }) {
  const defaultArea = {
    id: 1,
    name: "Room 1",
    doorCount: 0,
    skirtingMetres: 0,
    architraveMetres: 0,
    wardrobeMetres: 0,
    finishType: "standard",
    bespokeComplexity: "none"
  };

  const carpentryData = formData.carpentry || { areas: [defaultArea] };
  const [expandedAreas, setExpandedAreas] = useState([1]); // Changed initial state

  useEffect(() => {
    if (!formData.carpentry) {
      const newId = Date.now();
      updateFormData('carpentry', { areas: [{ ...defaultArea, id: newId }] });
      setExpandedAreas([newId]); // Added setExpandedAreas here
    } else if (carpentryData.areas.length > 0 && expandedAreas.length === 0) { // Added new condition
      setExpandedAreas([carpentryData.areas[0].id]);
    }
  }, [formData.carpentry]); // Changed dependency array

  const toggleAreaExpanded = (id) => {
    setExpandedAreas(prev =>
      prev.includes(id) ? prev.filter(areaId => areaId !== id) : [id]
    );
  };

  const updateCarpentry = (areas) => {
    updateFormData('carpentry', { areas });
  };

  const addArea = () => {
    const newArea = {
      ...defaultArea,
      id: Date.now(),
      name: `Room ${carpentryData.areas.length + 1}`,
    };
    updateCarpentry([...carpentryData.areas, newArea]);
    setExpandedAreas([newArea.id]);
  };

  const removeArea = (id) => {
    if (carpentryData.areas.length === 1) return;
    updateCarpentry(carpentryData.areas.filter(a => a.id !== id));
    setExpandedAreas(expandedAreas.filter(areaId => areaId !== id));
  };

  const updateArea = (id, field, value) => {
    const updated = carpentryData.areas.map(area =>
      area.id === id ? { ...area, [field]: value } : area
    );
    updateCarpentry(updated);
  };

  const getAreaSummary = (area) => {
    const items = [];
    if (area.doorCount > 0) items.push(`${area.doorCount} doors`);
    if (area.skirtingMetres > 0) items.push(`${area.skirtingMetres}m skirting`);
    if (area.wardrobeMetres > 0) items.push(`${area.wardrobeMetres}m storage`);
    return items.length > 0 ? items.join(' • ') : 'No items';
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Carpentry & Joinery
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add rooms and configure carpentry requirements for each
      </p>

      <div className="space-y-3">
        {carpentryData.areas.map((area) => {
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
                {carpentryData.areas.length > 1 && (
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Number of Doors</Label>
                      <NumericInput
                        value={area.doorCount}
                        onChange={(val) => updateArea(area.id, 'doorCount', val)}
                        min={0}
                        max={50}
                      />
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Skirting (linear metres)</Label>
                      <NumericInput
                        value={area.skirtingMetres}
                        onChange={(val) => updateArea(area.id, 'skirtingMetres', val)}
                        min={0}
                        max={500}
                        step={0.1}
                        decimals={1}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Architraves (linear metres)</Label>
                      <NumericInput
                        value={area.architraveMetres}
                        onChange={(val) => updateArea(area.id, 'architraveMetres', val)}
                        min={0}
                        max={500}
                        step={0.1}
                        decimals={1}
                      />
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Wardrobe/Alcove Storage (linear metres)</Label>
                      <NumericInput
                        value={area.wardrobeMetres}
                        onChange={(val) => updateArea(area.id, 'wardrobeMetres', val)}
                        min={0}
                        max={100}
                        step={0.1}
                        decimals={1}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Finish Type</Label>
                      <Select value={area.finishType} onValueChange={(val) => updateArea(area.id, 'finishType', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="sprayed">Sprayed Finish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Bespoke Storage Complexity</Label>
                      <Select value={area.bespokeComplexity} onValueChange={(val) => updateArea(area.id, 'bespokeComplexity', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="complex">Complex</SelectItem>
                        </SelectContent>
                      </Select>
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
