
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { Plus, Trash2, ChevronDown, ChevronUp, Home, Layers, MoveVertical, UtensilsCrossed, Bath } from "lucide-react";

const ROOM_TYPES = [
  { id: "standard", label: "Standard", icon: Home },
  { id: "hallway", label: "Hallway", icon: Layers },
  { id: "stairs", label: "Stairs & Landing", icon: MoveVertical },
  { id: "hall_stairs", label: "Hall + Stairs", icon: MoveVertical },
  { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { id: "bathroom", label: "Bathroom", icon: Bath }
];

export default function PaintingStep({ formData, updateFormData }) {
  const defaultRoom = {
    id: 1,
    name: "Room 1",
    type: "standard",
    size: "medium",
    surfaces: { walls: true, ceiling: true, woodwork: false },
    coats: 1,
    colours: 1,
    minorRepairs: true,
    wallpaperRemoval: "none",
    doors: 0,
    windows: 0,
    staircaseHeight: "single",
    spindleCount: 0,
    handrailsStringers: false
  };

  const paintingData = formData.painting || { rooms: [defaultRoom] };
  const [expandedRooms, setExpandedRooms] = useState([1]); // Changed initial state as per request

  useEffect(() => {
    if (!formData.painting) {
      const newId = Date.now();
      updateFormData('painting', { rooms: [{ ...defaultRoom, id: newId }] });
      setExpandedRooms([newId]);
    } else if (paintingData.rooms.length > 0 && expandedRooms.length === 0) { // New condition as per request
      setExpandedRooms([paintingData.rooms[0].id]);
    }
  }, [formData.painting, paintingData.rooms, expandedRooms.length]); // Added dependencies to useEffect

  const toggleRoomExpanded = (id) => {
    setExpandedRooms(prev => 
      prev.includes(id) ? prev.filter(roomId => roomId !== id) : [id]
    );
  };

  const updatePainting = (rooms) => {
    updateFormData('painting', { rooms });
  };

  const addRoom = () => {
    const newRoom = {
      ...defaultRoom,
      id: Date.now(),
      name: `Room ${paintingData.rooms.length + 1}`,
    };
    const updatedRooms = [...paintingData.rooms, newRoom];
    updatePainting(updatedRooms);
    setExpandedRooms([newRoom.id]);
  };

  const removeRoom = (id) => {
    if (paintingData.rooms.length === 1) return;
    updatePainting(paintingData.rooms.filter(r => r.id !== id));
    setExpandedRooms(prev => prev.filter(roomId => roomId !== id));
  };

  const updateRoom = (id, field, value) => {
    const updated = paintingData.rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    );
    updatePainting(updated);
  };

  const toggleSurface = (id, surface) => {
    const updated = paintingData.rooms.map(room => {
      if (room.id === id) {
        return {
          ...room,
          surfaces: { ...room.surfaces, [surface]: !room.surfaces[surface] }
        };
      }
      return room;
    });
    updatePainting(updated);
  };

  const getSurfacesSummary = (room) => {
    const surfaces = [];
    if (room.surfaces.walls) surfaces.push("Walls");
    if (room.surfaces.ceiling) surfaces.push("Ceiling");
    if (room.surfaces.woodwork) surfaces.push("Woodwork");
    return surfaces.join("+") || "None";
  };

  const getRoomSummary = (room) => {
    const typeLabel = {
      standard: 'Standard Room',
      hallway: 'Hallway',
      stairs: 'Stairs & Landing',
      hall_stairs: 'Hall + Stairs + Landing',
      kitchen: 'Kitchen / Diner',
      bathroom: 'Bathroom / WC'
    }[room.type || 'standard'];
    
    const size = room.size.charAt(0).toUpperCase() + room.size.slice(1);
    const surfaces = getSurfacesSummary(room);
    const coats = `${room.coats} coat${room.coats > 1 ? 's' : ''}`;
    return `${typeLabel} • ${size} • ${surfaces} • ${coats}`;
  };

  const isStairsType = (type) => {
    return type === 'stairs' || type === 'hall_stairs';
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Painting & Decorating
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add rooms and configure painting requirements for each
      </p>

      <div className="space-y-3">
        {paintingData.rooms.map((room) => {
          const isExpanded = expandedRooms.includes(room.id);
          
          return (
            <Card key={room.id} className="bg-[#151515] border-[#262626] overflow-hidden">
              <div 
                className="p-3 cursor-pointer hover:bg-[#262626]/50 transition-colors flex items-center justify-between touch-manipulation"
                onClick={() => toggleRoomExpanded(room.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#C8A74A]">{room.name}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#C8A74A]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#C8A74A]" />
                    )}
                  </div>
                  <p className="text-xs text-[#B8B8B8] truncate leading-tight">{getRoomSummary(room)}</p>
                </div>
                {paintingData.rooms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRoom(room.id);
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
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                      className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
                    />
                  </div>

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Room Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ROOM_TYPES.map(type => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => updateRoom(room.id, 'type', type.id)}
                            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border transition-all touch-manipulation ${
                              room.type === type.id
                                ? 'border-[#C8A74A] bg-[#C8A74A]/10'
                                : 'border-[#262626] bg-[#0E0E0E] hover:border-[#C8A74A]/50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 ${
                              room.type === type.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
                            }`} />
                            <span className={`text-xs font-medium text-center ${
                              room.type === type.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
                            }`}>
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {isStairsType(room.type) && (
                    <div className="p-3 bg-[#0E0E0E] border border-[#C8A74A]/30 rounded-lg space-y-3">
                      <p className="text-xs text-[#C8A74A] font-medium">Staircase Details</p>
                      
                      <div>
                        <Label className="text-[#F5F5F5] text-xs mb-2 block">Staircase Height</Label>
                        <Select 
                          value={room.staircaseHeight || 'single'} 
                          onValueChange={(val) => updateRoom(room.id, 'staircaseHeight', val)}
                        >
                          <SelectTrigger className="bg-[#151515] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                            <SelectItem value="single">Single-storey</SelectItem>
                            <SelectItem value="double">Double-height</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[#F5F5F5] text-xs mb-2 block">Banister Spindles</Label>
                        <NumericInput
                          value={room.spindleCount || 0}
                          onChange={(val) => updateRoom(room.id, 'spindleCount', val)}
                          min={0}
                          max={100}
                        />
                      </div>

                      <div
                        onClick={() => updateRoom(room.id, 'handrailsStringers', !room.handrailsStringers)}
                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                          room.handrailsStringers 
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10' 
                            : 'border-[#262626] bg-[#151515]'
                        }`}
                      >
                        <Checkbox
                          checked={room.handrailsStringers}
                          className={`border-white ${room.handrailsStringers ? 'bg-[#C8A74A]' : ''}`}
                        />
                        <span className={`text-xs font-medium ${room.handrailsStringers ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                          Handrails & Stringers
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Room Size</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'small', label: 'Small', desc: '3–5 m²' },
                        { id: 'medium', label: 'Medium', desc: '6–10 m²' },
                        { id: 'large', label: 'Large', desc: '10–14+ m²' }
                      ].map(size => (
                        <button
                          key={size.id}
                          onClick={() => updateRoom(room.id, 'size', size.id)}
                          className={`border rounded-lg p-2 cursor-pointer transition-all text-center touch-manipulation ${
                            room.size === size.id 
                              ? 'border-[#C8A74A] bg-[#C8A74A]/10' 
                              : 'border-[#262626] bg-[#0E0E0E] hover:border-[#C8A74A]/50'
                          }`}
                        >
                          <span className={`text-xs font-medium block ${room.size === size.id ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                            {size.label}
                          </span>
                          <span className={`text-xs mt-0.5 block ${room.size === size.id ? 'text-[#C8A74A]/70' : 'text-[#B8B8B8]'}`}>
                            {size.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Surfaces to Paint</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['walls', 'ceiling', 'woodwork'].map(surface => (
                        <div
                          key={surface}
                          onClick={() => toggleSurface(room.id, surface)}
                          className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                            room.surfaces[surface] 
                              ? 'border-[#C8A74A] bg-[#C8A74A]/10' 
                              : 'border-[#262626] bg-[#0E0E0E]'
                          }`}
                        >
                          <Checkbox
                            checked={room.surfaces[surface]}
                            className={`border-white ${room.surfaces[surface] ? 'bg-[#C8A74A]' : ''}`}
                          />
                          <span className={`text-xs font-medium capitalize ${
                            room.surfaces[surface] ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'
                          }`}>
                            {surface}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Number of Coats</Label>
                      <NumericInput
                        value={room.coats}
                        onChange={(val) => updateRoom(room.id, 'coats', val)}
                        min={1}
                        max={4}
                      />
                    </div>
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Number of Colours</Label>
                      <NumericInput
                        value={room.colours}
                        onChange={(val) => updateRoom(room.id, 'colours', val)}
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => updateRoom(room.id, 'minorRepairs', !room.minorRepairs)}
                    className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                      room.minorRepairs ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                    }`}
                  >
                    <Checkbox
                      checked={room.minorRepairs}
                      className={`border-white ${room.minorRepairs ? 'bg-[#C8A74A]' : ''} mt-0.5`}
                    />
                    <div>
                      <span className={`text-xs font-medium ${room.minorRepairs ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                        Minor Repairs
                      </span>
                      <p className="text-xs text-[#B8B8B8] mt-0.5">Small filler/caulk and light prep only.</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Wallpaper Removal</Label>
                    <Select 
                      value={room.wallpaperRemoval} 
                      onValueChange={(val) => updateRoom(room.id, 'wallpaperRemoval', val)}
                    >
                      <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="heavy-duty">Heavy-duty</SelectItem>
                        <SelectItem value="painted-over">Painted-over</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#B8B8B8] mt-1">Adds time for stripping old wallpaper before painting.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Doors</Label>
                      <NumericInput
                        value={room.doors}
                        onChange={(val) => updateRoom(room.id, 'doors', val)}
                        min={0}
                        max={20}
                      />
                    </div>
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Windows</Label>
                      <NumericInput
                        value={room.windows}
                        onChange={(val) => updateRoom(room.id, 'windows', val)}
                        min={0}
                        max={20}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        <Button
          onClick={addRoom}
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
