
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function BathroomStep({ formData, updateFormData }) {
  const defaultRoom = {
    id: 1,
    name: "Room 1",
    size: "medium",
    layout: "keep",
    fixtures: [],
    wallTiling: "0",
    floorTiling: false,
    tileSize: "standard",
    requireElectricalAlterations: false,
    electrics: [],
    requirePlumbingAlterations: false,
    plumbing: [],
    finishQuality: "standard",
    access: "easy"
  };

  const bathroomData = formData.bathroom || { rooms: [defaultRoom] };
  const [expandedRooms, setExpandedRooms] = useState([1]);

  useEffect(() => {
    if (!formData.bathroom) {
      const newId = Date.now();
      updateFormData('bathroom', { rooms: [{ ...defaultRoom, id: newId }] });
      setExpandedRooms([newId]);
    } else if (bathroomData.rooms.length > 0 && expandedRooms.length === 0) {
      setExpandedRooms([bathroomData.rooms[0].id]);
    }
  }, [formData.bathroom, updateFormData, bathroomData.rooms, defaultRoom, expandedRooms.length]);

  const toggleRoomExpanded = (id) => {
    setExpandedRooms(prev => 
      prev.includes(id) ? prev.filter(roomId => roomId !== id) : [id]
    );
  };

  const updateBathroom = (rooms) => {
    updateFormData('bathroom', { rooms });
  };

  const addRoom = () => {
    const newRoom = {
      ...defaultRoom,
      id: Date.now(),
      name: `Room ${bathroomData.rooms.length + 1}`,
    };
    const updatedRooms = [...bathroomData.rooms, newRoom];
    updateBathroom(updatedRooms);
    setExpandedRooms([newRoom.id]);
  };

  const removeRoom = (id) => {
    if (bathroomData.rooms.length === 1) return;
    updateBathroom(bathroomData.rooms.filter(r => r.id !== id));
    setExpandedRooms(expandedRooms.filter(roomId => roomId !== id));
  };

  const updateRoom = (id, field, value) => {
    const updated = bathroomData.rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    );
    updateBathroom(updated);
  };

  const toggleFixture = (id, item) => {
    const room = bathroomData.rooms.find(r => r.id === id);
    const current = room.fixtures || [];
    if (current.includes(item)) {
      updateRoom(id, 'fixtures', current.filter(i => i !== item));
    } else {
      updateRoom(id, 'fixtures', [...current, item]);
    }
  };

  const toggleElectrics = (id, item) => {
    const room = bathroomData.rooms.find(r => r.id === id);
    const current = room.electrics || [];
    if (current.includes(item)) {
      updateRoom(id, 'electrics', current.filter(i => i !== item));
    } else {
      updateRoom(id, 'electrics', [...current, item]);
    }
  };

  const togglePlumbing = (id, item) => {
    const room = bathroomData.rooms.find(r => r.id === id);
    const current = room.plumbing || [];
    if (current.includes(item)) {
      updateRoom(id, 'plumbing', current.filter(i => i !== item));
    } else {
      updateRoom(id, 'plumbing', [...current, item]);
    }
  };

  const getRoomSummary = (room) => {
    const size = room.size.charAt(0).toUpperCase() + room.size.slice(1);
    const layout = { keep: 'Keep', minor: 'Minor', major: 'Major' }[room.layout];
    const fixtures = room.fixtures?.length > 0 ? `${room.fixtures.length} fixtures` : 'No fixtures';
    const plumbingCount = room.plumbing?.length || 0;
    const plumbingText = plumbingCount > 0 ? `${plumbingCount} plumbing` : 'No plumbing';
    return `${size} • ${layout} layout • ${fixtures} • ${plumbingText}`;
  };

  const fixtures = [
    { id: "bath", label: "Bath" },
    { id: "shower", label: "Shower Enclosure" },
    { id: "basin", label: "Basin" },
    { id: "wc", label: "WC" },
    { id: "vanity", label: "Vanity" },
    { id: "towel_rail", label: "Towel Rail" }
  ];

  const electricsOptions = [
    { id: "downlights", label: "Downlights" },
    { id: "extractor", label: "Extractor Fan" },
    { id: "shaver_socket", label: "Shaver Socket" },
    { id: "mirror_light", label: "Mirror Light" }
  ];

  const plumbingOptions = [
    { id: "toilet", label: "Toilet" },
    { id: "shower_bath", label: "Shower/Bath" },
    { id: "wastepipe", label: "Wastepipe" },
    { id: "sink", label: "Sink" },
    { id: "radiator", label: "Radiator" }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#C8A74A] mb-1">
        Bathroom / WC
      </h2>
      <p className="text-sm text-[#B8B8B8] mb-4">
        Add bathrooms/WCs and configure requirements for each
      </p>

      <div className="space-y-3">
        {bathroomData.rooms.map((room) => {
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
                  <p className="text-xs text-[#B8B8B8] truncate">{getRoomSummary(room)}</p>
                </div>
                {bathroomData.rooms.length > 1 && (
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

                  {/* Size */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Bathroom Size</Label>
                    <RadioGroup value={room.size} onValueChange={(val) => updateRoom(room.id, 'size', val)}>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map(size => (
                          <div key={size} className={`border rounded-lg p-2 cursor-pointer transition-all touch-manipulation ${
                            room.size === size ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                          }`}>
                            <RadioGroupItem value={size} id={`${room.id}-${size}`} className="sr-only" />
                            <label htmlFor={`${room.id}-${size}`} className="cursor-pointer block text-center">
                              <span className={`text-xs font-medium capitalize ${room.size === size ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {size}
                              </span>
                              <p className={`text-xs mt-0.5 ${room.size === size ? 'text-[#C8A74A]/70' : 'text-[#B8B8B8]'}`}>
                                {size === 'small' ? '3-5 m²' : size === 'medium' ? '6-10 m²' : '10-14+ m²'}
                              </p>
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Layout */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Layout Change</Label>
                    <RadioGroup value={room.layout} onValueChange={(val) => updateRoom(room.id, 'layout', val)}>
                      <div className="grid grid-cols-3 gap-2">
                        {['keep', 'minor', 'major'].map(layout => (
                          <div key={layout} className={`border rounded-lg p-2 cursor-pointer touch-manipulation ${room.layout === layout ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'}`}>
                            <RadioGroupItem value={layout} id={`${room.id}-${layout}`} className="sr-only" />
                            <label htmlFor={`${room.id}-${layout}`} className="cursor-pointer text-center block">
                              <span className={`text-xs font-medium capitalize ${room.layout === layout ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {layout}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Fixtures */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Fixtures Required</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fixtures.map(option => (
                        <div
                          key={option.id}
                          onClick={() => toggleFixture(room.id, option.id)}
                          className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                            room.fixtures?.includes(option.id) ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                          }`}
                        >
                          <Checkbox
                            checked={room.fixtures?.includes(option.id)}
                            className={`border-white ${room.fixtures?.includes(option.id) ? 'bg-[#C8A74A]' : ''}`}
                          />
                          <span className={`text-xs ${room.fixtures?.includes(option.id) ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wall Tiling */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">Wall Tiling Coverage</Label>
                    <Select value={room.wallTiling} onValueChange={(val) => updateRoom(room.id, 'wallTiling', val)}>
                      <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                        <SelectItem value="0">0% - No tiling</SelectItem>
                        <SelectItem value="25">25% - Splash areas</SelectItem>
                        <SelectItem value="50">50% - Half height</SelectItem>
                        <SelectItem value="75">75% - Three quarter</SelectItem>
                        <SelectItem value="100">100% - Full height</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor Tiling & Tile Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div
                        onClick={() => updateRoom(room.id, 'floorTiling', !room.floorTiling)}
                        className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-all touch-manipulation ${
                          room.floorTiling ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                        }`}
                      >
                        <Checkbox
                          checked={room.floorTiling}
                          className={`border-white ${room.floorTiling ? 'bg-[#C8A74A]' : ''}`}
                        />
                        <span className={`text-xs font-medium ${room.floorTiling ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                          Floor Tiling
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Tile Size</Label>
                      <Select value={room.tileSize} onValueChange={(val) => updateRoom(room.id, 'tileSize', val)}>
                        <SelectTrigger className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1D1D] border-[#C8A74A] text-[#F5F5F5]">
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="slab">Slab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Electrical Alterations - Optional */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">
                      Do you require electrical alterations? <span className="text-xs text-[#B8B8B8] font-normal">(Optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateRoom(room.id, 'requireElectricalAlterations', false)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          !room.requireElectricalAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={() => updateRoom(room.id, 'requireElectricalAlterations', true)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          room.requireElectricalAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        Yes
                      </button>
                    </div>

                    {room.requireElectricalAlterations && (
                      <div className="mt-3 p-3 bg-[#0E0E0E] border border-[#C8A74A]/30 rounded-lg space-y-2">
                        <Label className="text-[#C8A74A] text-xs font-medium block">Select electrical work needed</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {electricsOptions.map(option => (
                            <div
                              key={option.id}
                              onClick={() => toggleElectrics(room.id, option.id)}
                              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                                room.electrics?.includes(option.id) ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                              }`}
                            >
                              <Checkbox
                                checked={room.electrics?.includes(option.id)}
                                className={`border-white ${room.electrics?.includes(option.id) ? 'bg-[#C8A74A]' : ''}`}
                              />
                              <span className={`text-xs ${room.electrics?.includes(option.id) ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Plumbing Alterations - Optional */}
                  <div>
                    <Label className="text-[#F5F5F5] text-sm mb-2 block">
                      Do you require plumbing alterations? <span className="text-xs text-[#B8B8B8] font-normal">(Optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateRoom(room.id, 'requirePlumbingAlterations', false)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          !room.requirePlumbingAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        No
                      </button>
                      <button
                        onClick={() => updateRoom(room.id, 'requirePlumbingAlterations', true)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all touch-manipulation ${
                          room.requirePlumbingAlterations
                            ? 'border-[#C8A74A] bg-[#C8A74A]/10 text-[#C8A74A]'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#F5F5F5]'
                        }`}
                      >
                        Yes
                      </button>
                    </div>

                    {room.requirePlumbingAlterations && (
                      <div className="mt-3 p-3 bg-[#0E0E0E] border border-[#C8A74A]/30 rounded-lg space-y-2">
                        <Label className="text-[#C8A74A] text-xs font-medium block">Select plumbing work needed</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {plumbingOptions.map(option => (
                            <div
                              key={option.id}
                              onClick={() => togglePlumbing(room.id, option.id)}
                              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all touch-manipulation ${
                                room.plumbing?.includes(option.id) ? 'border-[#C8A74A] bg-[#C8A74A]/10' : 'border-[#262626] bg-[#0E0E0E]'
                              }`}
                            >
                              <Checkbox
                                checked={room.plumbing?.includes(option.id)}
                                className={`border-white ${room.plumbing?.includes(option.id) ? 'bg-[#C8A74A]' : ''}`}
                              />
                              <span className={`text-xs ${room.plumbing?.includes(option.id) ? 'text-[#C8A74A]' : 'text-[#F5F5F5]'}`}>
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selects Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Finish Quality</Label>
                      <Select value={room.finishQuality} onValueChange={(val) => updateRoom(room.id, 'finishQuality', val)}>
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

                    <div>
                      <Label className="text-[#F5F5F5] text-sm mb-2 block">Site Access</Label>
                      <Select value={room.access} onValueChange={(val) => updateRoom(room.id, 'access', val)}>
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
          Add Another Bathroom / WC
        </Button>
      </div>
    </div>
  );
}
