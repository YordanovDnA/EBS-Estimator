
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const MATERIAL_DESCRIPTIONS = {
  cabinets: "Pre-assembled or flat-pack kitchen units, hinges and handles",
  worktops: "Laminate, solid wood, or quartz/stone surfaces depending on quality",
  appliances: "Oven, hob, extractor, and fridge-frezzer as a standard package",
  sink: "Kitchen sink, taps and fittings",
  kitchen_tiles: "Wall or floor tiles with grout and adhesive included",
  kitchen_hardware: "Door furniture, fixings and screws",
  bathroom_suite: "Bath or shower, basin, toilet, taps and fittings",
  bathroom_tiles: "Wall or floor tiles with grout and adhesive included",
  radiator: "Heated towel rail or standard radiator",
  bathroom_lighting: "Standard ceiling, pendant or LED downlight fittings",
  bathroom_hardware: "Door furniture, fixings and screws",
  flooring: "Laminate, LVT, wood or carpet materials per m²",
  underlay: "Foam or felt underlay for laminate and carpet",
  adhesive: "Tile adhesive, grout and levelling compound",
  beading: "Skirting board or beading trim per linear metre",
  paint: "Paint, primer, brushes and rollers per room",
  filler: "Wall filler, decorator's caulk and prep materials",
  protection: "Dust sheets, tape and protective materials",
  timber: "Softwood or hardwood timber per linear metre",
  boards: "MDF, plywood or chipboard sheets per m²",
  joinery_hardware: "Hinges, screws, brackets and fixings",
  finishes: "Wood stain, varnish or paint finishes",
  plaster: "Multi-finish or bonding plaster in bags",
  plasterboards: "Standard or moisture-resistant plasterboard per m²",
  beads_tape: "Corner beads, scrim tape and jointing compound",
  lighting: "Standard ceiling, pendant or LED downlight fittings",
  electrical: "Cables, sockets, switches and consumer unit materials",
  common_hardware: "General fixings, screws, plugs and sundries"
};

const MATERIALS_BY_MODULE = {
  kitchen: {
    title: "Kitchen Materials",
    items: {
      cabinets: { label: "Kitchen Cabinets", unit: "set", prices: { basic: [1000, 2000], standard: [2000, 3500], premium: [3500, 6000] } },
      worktops: { label: "Worktops", unit: "lm", prices: { basic: [40, 80], standard: [80, 140], premium: [220, 380] } },
      appliances: { label: "Appliances Set", unit: "set", prices: { basic: [900, 1400], standard: [1400, 2200], premium: [2200, 3500] } },
      sink: { label: "Sink & Tap", unit: "set", prices: { basic: [120, 250], standard: [250, 450], premium: [450, 800] } },
      kitchen_tiles: { label: "Tiles (Splashback)", unit: "m²", prices: { basic: [18, 28], standard: [28, 45], premium: [45, 75] } },
      kitchen_hardware: { label: "Hardware & Handles", unit: "set", prices: { basic: [40, 80], standard: [80, 150], premium: [150, 280] } }
    }
  },
  bathroom: {
    title: "Bathroom Materials",
    items: {
      bathroom_suite: { label: "Bathroom Suite", unit: "set", prices: { basic: [500, 900], standard: [900, 1600], premium: [1600, 3000] } },
      bathroom_tiles: { label: "Tiles & Adhesives", unit: "m²", prices: { basic: [18, 28], standard: [28, 45], premium: [45, 75] } },
      radiator: { label: "Radiator / Towel Rail", unit: "each", prices: { basic: [90, 150], standard: [150, 250], premium: [250, 450] } },
      bathroom_lighting: { label: "Lighting Fixtures", unit: "point", prices: { basic: [20, 40], standard: [40, 80], premium: [80, 150] } },
      bathroom_hardware: { label: "Hardware & Fittings", unit: "set", prices: { basic: [40, 80], standard: [80, 150], premium: [150, 280] } }
    }
  },
  flooring: {
    title: "Flooring Materials",
    items: {
      flooring: { label: "Flooring Materials", unit: "m²", prices: { basic: [12, 25], standard: [20, 40], premium: [30, 60] } },
      underlay: { label: "Underlay", unit: "m²", prices: { basic: [3, 5], standard: [5, 8], premium: [8, 12] } },
      adhesive: { label: "Adhesives & Grout", unit: "set", prices: { basic: [30, 50], standard: [50, 80], premium: [80, 120] } },
      beading: { label: "Skirting/Beading", unit: "lm", prices: { basic: [3, 6], standard: [6, 10], premium: [10, 18] } }
    }
  },
  painting: {
    title: "Painting Materials",
    items: {
      paint: { label: "Paint & Sundries", unit: "room", prices: { basic: [25, 40], standard: [40, 70], premium: [70, 120] } },
      filler: { label: "Filler & Caulk", unit: "set", prices: { basic: [15, 25], standard: [25, 40], premium: [40, 60] } },
      protection: { label: "Protection Materials", unit: "set", prices: { basic: [20, 35], standard: [35, 55], premium: [55, 80] } }
    }
  },
  carpentry: {
    title: "Joinery & Carpentry Materials",
    items: {
      timber: { label: "Timber", unit: "lm", prices: { basic: [5, 10], standard: [10, 18], premium: [18, 30] } },
      boards: { label: "Boards (MDF/Ply)", unit: "m²", prices: { basic: [8, 15], standard: [15, 25], premium: [25, 40] } },
      joinery_hardware: { label: "Hardware & Fixings", unit: "set", prices: { basic: [30, 50], standard: [50, 90], premium: [90, 150] } },
      finishes: { label: "Finishes & Stains", unit: "set", prices: { basic: [20, 35], standard: [35, 60], premium: [60, 100] } }
    }
  },
  plastering: {
    title: "Plastering Materials",
    items: {
      plaster: { label: "Plaster (bags)", unit: "bag", prices: { basic: [6, 10], standard: [10, 15], premium: [15, 22] } },
      plasterboards: { label: "Plasterboards", unit: "m²", prices: { basic: [5, 8], standard: [8, 12], premium: [12, 18] } },
      beads_tape: { label: "Beads & Tape", unit: "lm", prices: { basic: [2, 4], standard: [4, 7], premium: [7, 12] } }
    }
  },
  common: {
    title: "Common Materials",
    items: {
      lighting: { label: "Lighting Fixtures", unit: "point", prices: { basic: [20, 40], standard: [40, 80], premium: [80, 150] } },
      electrical: { label: "Electrical Supplies", unit: "set", prices: { basic: [50, 80], standard: [80, 140], premium: [140, 250] } },
      common_hardware: { label: "General Hardware", unit: "set", prices: { basic: [40, 70], standard: [70, 120], premium: [120, 200] } }
    }
  }
};

export default function MaterialsStep({ formData, updateFormData }) {
  const materialsData = formData.materials || {
    mode: "ballpark",
    selected: {},
    custom: [],
    contingency: 7,
    includeInTotal: true
  };

  // Determine which modules are selected
  const selectedServices = formData.selectedServices || [];
  
  // Filter modules based on selected services
  const getVisibleModules = () => {
    const modules = [];
    if (selectedServices.includes('kitchen')) modules.push('kitchen');
    if (selectedServices.includes('bathroom')) modules.push('bathroom');
    if (selectedServices.includes('flooring')) modules.push('flooring');
    if (selectedServices.includes('painting')) modules.push('painting');
    if (selectedServices.includes('carpentry')) modules.push('carpentry');
    if (selectedServices.includes('plastering')) modules.push('plastering');
    modules.push('common'); // Always show common materials
    return modules;
  };

  const visibleModules = getVisibleModules();
  
  // Start with contingency expanded only
  const [expandedModules, setExpandedModules] = useState(['contingency']);

  const toggleModuleExpanded = (module) => {
    setExpandedModules(prev => 
      prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
    );
  };

  const updateMaterials = (field, value) => {
    updateFormData('materials', {
      ...materialsData,
      [field]: value
    });
  };

  const toggleItem = (itemId) => {
    const current = materialsData.selected[itemId];
    if (current) {
      const { [itemId]: _, ...rest } = materialsData.selected;
      updateMaterials('selected', rest);
    } else {
      updateMaterials('selected', {
        ...materialsData.selected,
        [itemId]: { quality: 'standard', quantity: 1 }
      });
    }
  };

  const updateItem = (itemId, field, value) => {
    updateMaterials('selected', {
      ...materialsData.selected,
      [itemId]: {
        ...materialsData.selected[itemId],
        [field]: value
      }
    });
  };

  const addCustomItem = () => {
    updateMaterials('custom', [
      ...materialsData.custom,
      { id: Date.now(), name: "Custom Item", amount: 0 }
    ]);
  };

  const updateCustomItem = (id, field, value) => {
    updateMaterials('custom', 
      materialsData.custom.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeCustomItem = (id) => {
    updateMaterials('custom', materialsData.custom.filter(item => item.id !== id));
  };

  const calculateBallparkTotal = () => {
    let low = 0;
    let high = 0;

    Object.entries(materialsData.selected).forEach(([itemId, config]) => {
      let itemData = null;
      for (const module of Object.values(MATERIALS_BY_MODULE)) {
        if (module.items[itemId]) {
          itemData = module.items[itemId];
          break;
        }
      }
      
      if (itemData && itemData.prices[config.quality]) {
        const [priceLow, priceHigh] = itemData.prices[config.quality];
        const qty = config.quantity || 1;
        low += priceLow * qty;
        high += priceHigh * qty;
      }
    });

    const contingencyMult = 1 + (materialsData.contingency / 100);
    low = Math.round(low * contingencyMult / 5) * 5;
    high = Math.round(high * contingencyMult / 5) * 5;

    return { low, high, mid: Math.round((low + high) / 2) };
  };

  const calculateCustomTotal = () => {
    const total = materialsData.custom.reduce((sum, item) => sum + (item.amount || 0), 0);
    return { low: total, high: total, mid: total };
  };

  const totals = materialsData.mode === 'ballpark' 
    ? calculateBallparkTotal() 
    : calculateCustomTotal();

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Materials <span className="text-xs text-[#B8B8B8] font-normal">(Optional)</span>
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add approximate or custom materials costs
      </p>

      {/* Mode Toggle */}
      <div className="mb-4">
        <div className="inline-flex rounded-lg border border-[#262626] p-1 bg-[#0E0E0E]">
          <button
            onClick={() => updateMaterials('mode', 'ballpark')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              materialsData.mode === 'ballpark'
                ? 'bg-[#C8A74A] text-[#0E0E0E]'
                : 'text-[#B8B8B8] hover:text-[#C8A74A]'
            }`}
          >
            Ballpark
          </button>
          <button
            onClick={() => updateMaterials('mode', 'custom')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              materialsData.mode === 'custom'
                ? 'bg-[#C8A74A] text-[#0E0E0E]'
                : 'text-[#B8B8B8] hover:text-[#C8A74A]'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {materialsData.mode === 'ballpark' ? (
        <div className="space-y-3">
          {/* Module Sections - only show relevant ones */}
          {visibleModules.map(moduleKey => {
            const module = MATERIALS_BY_MODULE[moduleKey];
            if (!module) return null;
            
            const isExpanded = expandedModules.includes(moduleKey);
            const moduleItems = Object.entries(module.items);
            const selectedCount = moduleItems.filter(([itemId]) => materialsData.selected[itemId]).length;

            return (
              <Card key={moduleKey} className="bg-[#151515] border-[#262626] overflow-hidden">
                <div 
                  className="p-3 cursor-pointer hover:bg-[#262626]/50 transition-colors flex items-center justify-between"
                  onClick={() => toggleModuleExpanded(moduleKey)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#C8A74A]">{module.title}</span>
                    {selectedCount > 0 && (
                      <span className="text-xs bg-[#C8A74A]/20 text-[#C8A74A] px-2 py-0.5 rounded-full">
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#C8A74A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#C8A74A]" />
                  )}
                </div>

                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-[#262626] space-y-2">
                    {moduleItems.map(([itemId, itemData]) => {
                      const isSelected = !!materialsData.selected[itemId];
                      const config = materialsData.selected[itemId] || { quality: 'standard', quantity: 1 };

                      return (
                        <div key={itemId} className={`p-3 rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-[#C8A74A]/10 border-[#C8A74A]/50' 
                            : 'bg-[#0E0E0E] border-[#262626]'
                        }`}>
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleItem(itemId)}
                              className={isSelected ? 'border-[#C8A74A] bg-[#C8A74A] mt-0.5' : 'mt-0.5'}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <Label className={`text-sm ${isSelected ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                  {itemData.label}
                                </Label>
                                <span className="text-xs text-[#B8B8B8]">per {itemData.unit}</span>
                              </div>
                              {MATERIAL_DESCRIPTIONS[itemId] && (
                                <p className="text-xs text-[#B8B8B8] mb-2">{MATERIAL_DESCRIPTIONS[itemId]}</p>
                              )}

                              {isSelected && (
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-[#F5F5F5] text-xs mb-1 block">Quality</Label>
                                    <Select
                                      value={config.quality}
                                      onValueChange={(val) => updateItem(itemId, 'quality', val)}
                                    >
                                      <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label className="text-[#F5F5F5] text-xs mb-1 block">Quantity ({itemData.unit})</Label>
                                    <NumericInput
                                      value={config.quantity}
                                      onChange={(val) => updateItem(itemId, 'quantity', val)}
                                      min={0.1}
                                      max={1000}
                                      step={itemData.unit === 'm²' || itemData.unit === 'lm' ? 0.1 : 1}
                                      decimals={itemData.unit === 'm²' || itemData.unit === 'lm' ? 1 : 0}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}

          {/* Contingency - Always expanded */}
          <Card className="p-3 bg-[#151515] border-[#262626]">
            <Label className="text-[#F5F5F5] text-sm mb-2 block">
              Contingency ({materialsData.contingency}%)
            </Label>
            <p className="text-xs text-[#B8B8B8] mb-3">Allowance for small unforeseen extras (5–10%)</p>
            <input
              type="range"
              min="5"
              max="10"
              step="1"
              value={materialsData.contingency}
              onChange={(e) => updateMaterials('contingency', parseInt(e.target.value))}
              className="w-full accent-[#C8A74A]"
            />
            <div className="flex justify-between text-xs text-[#B8B8B8] mt-1">
              <span>5%</span>
              <span>10%</span>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {materialsData.custom.map((item) => (
            <Card key={item.id} className="p-3 bg-[#151515] border-[#262626]">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#F5F5F5] text-xs mb-1 block">Item Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateCustomItem(item.id, 'name', e.target.value)}
                      className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm"
                      placeholder="e.g. Custom Shelving"
                    />
                  </div>
                  <div>
                    <Label className="text-[#F5F5F5] text-xs mb-1 block">Amount (£)</Label>
                    <NumericInput
                      value={item.amount}
                      onChange={(val) => updateCustomItem(item.id, 'amount', val)}
                      min={0}
                      max={100000}
                      step={5}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomItem(item.id)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10 mt-5 h-7 w-7"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}

          <Button
            onClick={addCustomItem}
            variant="outline"
            className="w-full h-9 border border-[#C8A74A]/30 bg-transparent text-[#C8A74A] hover:bg-[#C8A74A]/10 gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Custom Item
          </Button>
        </div>
      )}

      {/* Summary */}
      <Card className="mt-4 p-4 bg-gradient-to-br from-[#151515] to-[#0E0E0E] border-[#C8A74A]/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#F5F5F5] font-medium">Materials Subtotal</span>
            <span className="text-base font-bold text-[#C8A74A]">
              {materialsData.mode === 'ballpark' 
                ? `£${totals.low.toLocaleString()} - £${totals.high.toLocaleString()}`
                : `£${totals.mid.toLocaleString()}`
              }
            </span>
          </div>

          <div className="pt-3 border-t border-[#262626]">
            <div
              onClick={() => updateMaterials('includeInTotal', !materialsData.includeInTotal)}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                materialsData.includeInTotal 
                  ? 'border-[#C8A74A] bg-[#C8A74A]/10' 
                  : 'border-[#262626] bg-[#0E0E0E]'
              }`}
            >
              <Checkbox
                checked={materialsData.includeInTotal}
                className={materialsData.includeInTotal ? 'border-[#C8A74A] bg-[#C8A74A]' : ''}
              />
              <span className={`text-sm font-medium ${
                materialsData.includeInTotal ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
              }`}>
                Include in Project Total
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
