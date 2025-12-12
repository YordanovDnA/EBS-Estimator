import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Mail,
  Calendar,
  HardHat,
  CheckCircle2,
  Home,
  Building2,
  Building,
} from "lucide-react";
function getRoomBullets(moduleName, room) {
  switch (moduleName) {
    case "Painting & Decorating":
      return formatPaintingRoom(room);

    case "Kitchen":
      return formatKitchenRoom(room);

    case "Bathroom / WC":
      return formatBathroomRoom(room);

    case "Flooring & Tiling":
      return formatFlooringRoom(room);

    case "Carpentry & Joinery":
      return formatCarpentryRoom(room);

    case "Plastering & Patching":
      return formatPlasteringRoom(room);

    default:
      return [];
  }
}

// Simple HTML escape function
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Property multipliers
const PROPERTY_MULTIPLIERS = {
  detached: 1.25,
  "semi-detached": 1.15,
  "end-terrace": 1.1,
  terrace: 1.0,
  bungalow: 1.1,
  flat: 0.85,
};

// Property type icons
const PROPERTY_ICONS = {
  detached: Home,
  "semi-detached": Building2,
  "end-terrace": Building,
  terrace: Building,
  bungalow: Home,
  flat: Building,
};

// Rate tiers
const RATES = {
  economy: { daily: 200, efficiency: 1.0 },
  standard: { daily: 250, efficiency: 0.9 },
  premium: { daily: 280, efficiency: 0.85 },
};

const DESIGN_PERCENTAGES = {
  none: 0,
  procurement: 7,
  management_procurement: 11,
  full: 12,
};

function generateModuleDetails(formData) {
  const details = [];

  // -------------------------
  // KITCHEN (Multi-room)
  // -------------------------
  if (formData.kitchen?.areas) {
    const rooms = formData.kitchen.areas.map((area) => ({
      title: area.name,
      size: area.size,
      worktop: area.worktop,
      splashback: area.splashback,
      electrical: area.requireElectricalAlterations ? area.electrics : [],
      plumbing: area.requirePlumbingAlterations ? area.plumbing : [],
      floorTiling: area.requireFloorTiling ? area.floorTilingArea : null,
    }));
    details.push({ module: "Kitchen", rooms });
  }

  // -------------------------
  // BATHROOM / WC
  // -------------------------
  if (formData.bathroom?.rooms) {
    const rooms = formData.bathroom.rooms.map((room) => ({
      title: room.name,
      size: room.size,
      layout: room.layout,
      fixtures: room.fixtures,
      wallTiling: room.wallTiling,
      floorTiling: room.floorTiling,
      tileSize: room.tileSize,
      electrical: room.requireElectricalAlterations ? room.electrics : [],
      plumbing: room.requirePlumbingAlterations ? room.plumbing : [],
      finishQuality: room.finishQuality,
      access: room.access,
    }));
    details.push({ module: "Bathroom / WC", rooms });
  }

  // -------------------------
  // FLOORING & TILING
  // -------------------------
  if (formData.flooring?.areas) {
    const rooms = formData.flooring.areas.map((area) => ({
      title: area.name,
      type: area.type,
      area: area.area,
      subfloor: area.subfloor,
      layout: area.layout,
      pattern: area.pattern,
      finishQuality: area.finishQuality,
      removeOld: area.removeOld,
      trimDoors: area.trimDoors,
      fitSkirting: area.fitSkirting,
    }));
    details.push({ module: "Flooring & Tiling", rooms });
  }

  // -------------------------
  // CARPENTRY
  // -------------------------
  if (formData.carpentry?.areas) {
    const rooms = formData.carpentry.areas.map((area) => ({
      title: area.name,
      doorCount: area.doorCount,
      skirtingMetres: area.skirtingMetres,
      architraveMetres: area.architraveMetres,
      wardrobeMetres: area.wardrobeMetres,
      finishType: area.finishType,
      bespokeComplexity: area.bespokeComplexity,
    }));
    details.push({ module: "Carpentry & Joinery", rooms });
  }

  // -------------------------
  // PAINTING
  // -------------------------
  if (formData.painting?.rooms) {
    const rooms = formData.painting.rooms.map((room) => ({
      title: room.name,
      type: room.type,
      size: room.size,
      surfaces: room.surfaces,
      coats: room.coats,
      colours: room.colours,
      wallpaperRemoval: room.wallpaperRemoval,
      doors: room.doors,
      windows: room.windows,
      spindleCount: room.spindleCount,
      handrailsStringers: room.handrailsStringers,
      minorRepairs: room.minorRepairs,
    }));
    details.push({ module: "Painting & Decorating", rooms });
  }

  // -------------------------
  // PLASTERING
  // -------------------------
  if (formData.plastering?.areas) {
    const rooms = formData.plastering.areas.map((area) => ({
      title: area.name,
      workType: area.workType,
      area: area.area,
      patchCount: area.patchCount,
      surfaceCondition: area.surfaceCondition,
      finishLevel: area.finishLevel,
      access: area.access,
    }));
    details.push({ module: "Plastering & Patching", rooms });
  }

  return details;
}

function calculateQuote(formData) {
  const propertyMultiplier = PROPERTY_MULTIPLIERS[formData.propertyType] || 1.0;
  const services = [];
  let totalDaysLow = 0;
  let totalDaysHigh = 0;
  let totalCostLow = 0;
  let totalCostHigh = 0;

  // Kitchen calculation - MULTI ROOM
  if (formData.kitchen?.areas) {
    let totalKitchenDaysLow = 0;
    let totalKitchenDaysHigh = 0;

    formData.kitchen.areas.forEach((area) => {
      if (!area) return;

      let baseDaysLow =
        area.size === "small" ? 3 : area.size === "large" ? 8 : 5;
      let baseDaysHigh =
        area.size === "small" ? 5 : area.size === "large" ? 12 : 8;

      const electricsAdd = (area.electrics?.length || 0) * 0.15;
      const plumbingAdd = (area.plumbing?.length || 0) * 0.12;
      baseDaysLow += electricsAdd + plumbingAdd;
      baseDaysHigh += electricsAdd + plumbingAdd;

      if (area.splashback) {
        baseDaysLow += 0.5;
        baseDaysHigh += 0.5;
      }

      if (area.requireFloorTiling && area.floorTilingArea > 0) {
        const tilingDays = Math.min(1 + area.floorTilingArea / 12, 2.0);
        baseDaysLow += tilingDays * 0.8;
        baseDaysHigh += tilingDays;
      }

      const worktopMult =
        {
          laminate: 1.0,
          solid_wood: 1.1,
          quartz: 1.15,
          granite: 1.2,
          marble: 1.25,
        }[area.worktop] || 1.0;

      baseDaysLow *= worktopMult;
      baseDaysHigh *= worktopMult;

      totalKitchenDaysLow += baseDaysLow;
      totalKitchenDaysHigh += baseDaysHigh;
    });

    const efficiency = RATES.standard.efficiency;
    const daysLow = totalKitchenDaysLow * efficiency * propertyMultiplier;
    const daysHigh = totalKitchenDaysHigh * efficiency * propertyMultiplier;

    const costLow = Math.round((daysLow * RATES.standard.daily) / 5) * 5;
    const costHigh = Math.round((daysHigh * RATES.standard.daily) / 5) * 5;

    services.push({ name: "Kitchen", daysLow, daysHigh, costLow, costHigh });
    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  // Bathroom / WC calculation - MULTI ROOM with new plumbing mapping
  if (formData.bathroom?.rooms) {
    let totalBathroomDaysLow = 0;
    let totalBathroomDaysHigh = 0;

    formData.bathroom.rooms.forEach((room) => {
      if (!room) return;

      let baseDaysLow =
        room.size === "small" ? 5 : room.size === "large" ? 12 : 8;
      let baseDaysHigh =
        room.size === "small" ? 8 : room.size === "large" ? 18 : 12;

      const layoutMult =
        room.layout === "keep" ? 1.0 : room.layout === "minor" ? 1.1 : 1.25;
      baseDaysLow *= layoutMult;
      baseDaysHigh *= layoutMult;

      const fixtureAdd = (room.fixtures?.length || 0) * 0.2;
      baseDaysLow += fixtureAdd;
      baseDaysHigh += fixtureAdd;
      if (room.fixtures?.includes("shower")) {
        baseDaysLow += 0.15;
        baseDaysHigh += 0.15;
      }

      const wallTilingAdd =
        {
          0: 0,
          25: 0.5,
          50: 1.0,
          75: 1.5,
          100: 2.0,
        }[room.wallTiling] || 0;
      baseDaysLow += wallTilingAdd * 0.8;
      baseDaysHigh += wallTilingAdd;

      if (room.floorTiling) {
        baseDaysLow += 0.6;
        baseDaysHigh += 0.8;
      }

      const tileSizeMult =
        {
          small: 1.1,
          standard: 1.0,
          large: 1.1,
          slab: 1.25,
        }[room.tileSize] || 1.0;
      baseDaysLow *= tileSizeMult;
      baseDaysHigh *= tileSizeMult;

      const electricsAdd = (room.electrics?.length || 0) * 0.15;
      baseDaysLow += electricsAdd;
      baseDaysHigh += electricsAdd;

      // Map plumbing items to old complexity logic
      const plumbingCount = room.plumbing?.length || 0;
      const plumbingComplexity =
        plumbingCount === 0
          ? "light"
          : plumbingCount <= 2
          ? "moderate"
          : "heavy";

      const plumbingMult = {
        light: 1.0,
        moderate: 1.1,
        heavy: 1.2,
      }[plumbingComplexity];
      baseDaysLow *= plumbingMult;
      baseDaysHigh *= plumbingMult;

      const finishMult =
        {
          standard: 1.0,
          high: 1.08,
          premium: 1.15,
        }[room.finishQuality] || 1.0;
      baseDaysLow *= finishMult;
      baseDaysHigh *= finishMult;

      const accessMult =
        {
          easy: 1.0,
          stairs: 1.07,
          no_parking: 1.1,
        }[room.access] || 1.0;
      baseDaysLow *= accessMult;
      baseDaysHigh *= accessMult;

      totalBathroomDaysLow += baseDaysLow;
      totalBathroomDaysHigh += baseDaysHigh;
    });

    const efficiency = RATES.standard.efficiency;
    const daysLow = totalBathroomDaysLow * efficiency * propertyMultiplier;
    const daysHigh = totalBathroomDaysHigh * efficiency * propertyMultiplier;

    const costLow = Math.round((daysLow * RATES.standard.daily) / 5) * 5;
    const costHigh = Math.round((daysHigh * RATES.standard.daily) / 5) * 5;

    services.push({
      name: "Bathroom / WC",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
    });
    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  // Flooring calculation - MULTI ROOM
  if (formData.flooring?.areas) {
    let totalFlooringDaysLow = 0;
    let totalFlooringDaysHigh = 0;
    let totalFlooringCostLow = 0;
    let totalFlooringCostHigh = 0;

    formData.flooring.areas.forEach((area) => {
      if (!area || !area.type || !area.area) return;

      const speedsPerDay = {
        laminate: 18,
        lvt: 10,
        engineered_wood: 12,
        solid_wood: 8,
        carpet: 25,
        tiles: 8,
      };
      const baseSpeed = speedsPerDay[area.type] || 15;
      let baseDays = area.area / baseSpeed;

      const subfloorMult =
        {
          good: 1.0,
          uneven: 1.2,
          poor: 1.35,
        }[area.subfloor] || 1.0;
      baseDays *= subfloorMult;

      const layoutMult =
        {
          simple: 1.0,
          complex: 1.15,
          multiple: 1.25,
        }[area.layout] || 1.0;
      baseDays *= layoutMult;

      const patternMult =
        {
          straight: 1.0,
          diagonal: 1.15,
          herringbone: 1.35,
        }[area.pattern] || 1.0;
      baseDays *= patternMult;

      const finishMult =
        {
          standard: 1.0,
          high: 1.08,
          premium: 1.15,
        }[area.finishQuality] || 1.0;
      baseDays *= finishMult;

      if (area.removeOld) baseDays += 0.5;
      baseDays += (area.trimDoors || 0) * 0.1;
      if (area.fitSkirting) baseDays += 0.5;

      const areaDaysLow = baseDays * 0.85;
      const areaDaysHigh = baseDays * 1.15;

      totalFlooringDaysLow += areaDaysLow;
      totalFlooringDaysHigh += areaDaysHigh;

      let areaCostLow = areaDaysLow * RATES.standard.daily;
      let areaCostHigh = areaDaysHigh * RATES.standard.daily;

      if (area.wasteRemoval) {
        areaCostLow += 100;
        areaCostHigh += 100;
      }

      totalFlooringCostLow += areaCostLow;
      totalFlooringCostHigh += areaCostHigh;
    });

    const efficiency = RATES.standard.efficiency;
    const daysLow = totalFlooringDaysLow * efficiency * propertyMultiplier;
    const daysHigh = totalFlooringDaysHigh * efficiency * propertyMultiplier;

    const costLow =
      Math.round((totalFlooringCostLow * efficiency * propertyMultiplier) / 5) *
      5;
    const costHigh =
      Math.round(
        (totalFlooringCostHigh * efficiency * propertyMultiplier) / 5
      ) * 5;

    services.push({
      name: "Flooring & Tiling",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
    });
    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  // Carpentry calculation - MULTI ROOM
  if (formData.carpentry?.areas) {
    let totalCarpentryDaysLow = 0;
    let totalCarpentryDaysHigh = 0;

    formData.carpentry.areas.forEach((area) => {
      if (!area) return;

      let baseDays = 0;
      baseDays += (area.doorCount || 0) * 0.4;
      baseDays += (area.skirtingMetres || 0) / 15;
      baseDays += (area.architraveMetres || 0) / 15;
      baseDays += (area.wardrobeMetres || 0) * 0.6;
      baseDays += (area.doorCount || 0) * 0.05;

      const finishMult =
        {
          standard: 1.0,
          premium: 1.15,
          sprayed: 1.2,
        }[area.finishType] || 1.0;
      baseDays *= finishMult;

      const bespokeMult =
        {
          none: 1.0,
          simple: 1.0,
          moderate: 1.15,
          complex: 1.3,
        }[area.bespokeComplexity] || 1.0;
      baseDays *= bespokeMult;

      totalCarpentryDaysLow += baseDays * 0.9;
      totalCarpentryDaysHigh += baseDays * 1.1;
    });

    const efficiency = RATES.standard.efficiency;
    const daysLow = totalCarpentryDaysLow * efficiency * propertyMultiplier;
    const daysHigh = totalCarpentryDaysHigh * efficiency * propertyMultiplier;

    const costLow = Math.round((daysLow * RATES.standard.daily) / 5) * 5;
    const costHigh = Math.round((daysHigh * RATES.standard.daily) / 5) * 5;

    services.push({
      name: "Carpentry & Joinery",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
    });
    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  // Painting calculation - MULTI ROOM with Room Type
  if (formData.painting?.rooms) {
    let totalDays = 0;

    formData.painting.rooms.forEach((room) => {
      if (!room) return;

      let roomDays = 0;

      const baseDaysPerSurface = {
        small: { walls: 0.6, ceiling: 0.25, woodwork: 0.5 },
        medium: { walls: 0.8, ceiling: 0.3, woodwork: 0.6 },
        large: { walls: 1.2, ceiling: 0.4, woodwork: 0.8 },
      };

      const surfaceDays = baseDaysPerSurface[room.size];
      if (room.surfaces.walls) roomDays += surfaceDays.walls;
      if (room.surfaces.ceiling) roomDays += surfaceDays.ceiling;
      if (room.surfaces.woodwork) roomDays += surfaceDays.woodwork;

      const roomTypeFactor = {
        standard: 1.0,
        hallway: 1.15,
        stairs: 1.35,
        hall_stairs: 1.5,
        kitchen: 1.1,
        bathroom: 0.85,
      }[room.type || "standard"];
      roomDays *= roomTypeFactor;

      if (room.type === "stairs" || room.type === "hall_stairs") {
        if (room.staircaseHeight === "double") roomDays += 0.4;
        roomDays += 0.02 * (room.spindleCount || 0);
        if (room.handrailsStringers) roomDays += 0.1;
      }

      if (room.coats > 1) {
        roomDays *= 1 + 0.5 * (room.coats - 1);
      }

      if (room.colours > 1) {
        roomDays *= 1 + 0.05 * (room.colours - 1);
      }

      if (room.minorRepairs) {
        roomDays += 0.2;
      }

      if (room.wallpaperRemoval !== "none" && room.surfaces.walls) {
        const removalBaseDays = {
          small: 0.5,
          medium: 0.6,
          large: 0.9,
        }[room.size];

        const diffMult = {
          standard: 1.0,
          "heavy-duty": 1.35,
          "painted-over": 1.5,
        }[room.wallpaperRemoval];

        roomDays += removalBaseDays * diffMult;
      }

      roomDays += (room.doors || 0) * 0.1;
      roomDays += (room.windows || 0) * 0.08;

      totalDays += roomDays;
    });

    const efficiency = RATES.economy.efficiency;
    const daysLow = totalDays * 0.9 * efficiency * propertyMultiplier;
    const daysHigh = totalDays * 1.1 * efficiency * propertyMultiplier;

    const costLow = Math.round((daysLow * RATES.economy.daily) / 5) * 5;
    const costHigh = Math.round((daysHigh * RATES.economy.daily) / 5) * 5;

    services.push({
      name: "Painting & Decorating",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
    });
    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  // Plastering calculation - MULTI ROOM
  if (formData.plastering?.areas) {
    let totalPlasteringDaysLow = 0;
    let totalPlasteringDaysHigh = 0;

    formData.plastering.areas.forEach((area) => {
      if (!area) return;

      let baseDays = 0;

      if (area.workType === "patch") {
        baseDays = (area.patchCount || 0) * 0.4;
      } else if (area.workType === "reskim") {
        baseDays = (area.area || 0) / 27.5;
      } else if (area.workType === "reboard") {
        baseDays = (area.area || 0) / 10;
      } else if (area.workType === "artex") {
        baseDays = ((area.area || 0) / 27.5) * 1.4;
      }

      const conditionMult =
        {
          good: 1.0,
          fair: 1.1,
          poor: 1.25,
        }[area.surfaceCondition] || 1.0;
      baseDays *= conditionMult;

      const finishMult =
        {
          standard: 1.0,
          high: 1.08,
          premium: 1.15,
        }[area.finishLevel] || 1.0;
      baseDays *= finishMult;

      const accessMult =
        {
          easy: 1.0,
          stairs: 1.07,
          no_parking: 1.1,
        }[area.access] || 1.0;
      baseDays *= accessMult;

      totalPlasteringDaysLow += baseDays * 0.9;
      totalPlasteringDaysHigh += baseDays * 1.1;
    });

    const efficiency = RATES.standard.efficiency;
    const daysLow = totalPlasteringDaysLow * efficiency * propertyMultiplier;
    const daysHigh = totalPlasteringDaysHigh * efficiency * propertyMultiplier;

    const costLow = Math.round((daysLow * RATES.standard.daily) / 5) * 5;
    const costHigh = Math.round((daysHigh * RATES.standard.daily) / 5) * 5;

    services.push({
      name: "Plastering & Patching",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
    });
    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  // Additional services
  const additionals = [];
  let additionalsTotal = 0;
  if (formData.additionals) {
    formData.additionals.forEach((add) => {
      const total = add.price * add.quantity;
      additionalsTotal += total;
      const names = {
        socket: "Add Socket",
        radiator: "Move Radiator",
        skip: "Skip Hire",
        toilet: "Builder's Toilet",
        protection: "Site Protection",
        cleaning: "Deep Cleaning",
      };
      additionals.push({
        name: names[add.id] || add.id,
        quantity: add.quantity,
        total,
      });
    });
  }

  totalCostLow += additionalsTotal;
  totalCostHigh += additionalsTotal;

  // Materials calculation
  let materialsLow = 0;
  let materialsHigh = 0;
  let materialsMid = 0;
  let materialsIncluded = false;
  const materialsList = [];

  if (formData.materials && formData.materials.includeInTotal) {
    materialsIncluded = true;

    if (formData.materials.mode === "ballpark" && formData.materials.selected) {
      const BALLPARK_PRICES = {
        cabinets: {
          basic: [1000, 2000],
          standard: [2000, 3500],
          premium: [3500, 6000],
        },
        worktops: { basic: [40, 80], standard: [80, 140], premium: [220, 380] },
        appliances: {
          basic: [900, 1400],
          standard: [1400, 2200],
          premium: [2200, 3500],
        },
        sink: { basic: [120, 250], standard: [250, 450], premium: [450, 800] },
        radiator: {
          basic: [90, 150],
          standard: [150, 250],
          premium: [250, 450],
        },
        bathroom_suite: {
          basic: [500, 900],
          standard: [900, 1600],
          premium: [1600, 3000],
        },
        flooring: { basic: [12, 25], standard: [20, 40], premium: [30, 60] },
        kitchen_tiles: {
          basic: [18, 28],
          standard: [28, 45],
          premium: [45, 75],
        },
        bathroom_tiles: {
          basic: [18, 28],
          standard: [28, 45],
          premium: [45, 75],
        },
        paint: { basic: [25, 40], standard: [40, 70], premium: [70, 120] },
        lighting: { basic: [20, 40], standard: [40, 80], premium: [80, 150] },
        bathroom_lighting: {
          basic: [20, 40],
          standard: [40, 80],
          premium: [80, 150],
        },
        kitchen_hardware: {
          basic: [40, 80],
          standard: [80, 150],
          premium: [150, 280],
        },
        bathroom_hardware: {
          basic: [40, 80],
          standard: [80, 150],
          premium: [150, 280],
        },
        underlay: { basic: [3, 5], standard: [5, 8], premium: [8, 12] },
        adhesive: { basic: [30, 50], standard: [50, 80], premium: [80, 120] },
        beading: { basic: [3, 6], standard: [6, 10], premium: [10, 18] },
        filler: { basic: [15, 25], standard: [25, 40], premium: [40, 60] },
        protection: { basic: [20, 35], standard: [35, 55], premium: [55, 80] },
        timber: { basic: [5, 10], standard: [10, 18], premium: [18, 30] },
        boards: { basic: [8, 15], standard: [15, 25], premium: [25, 40] },
        joinery_hardware: {
          basic: [30, 50],
          standard: [50, 90],
          premium: [90, 150],
        },
        finishes: { basic: [20, 35], standard: [35, 60], premium: [60, 100] },
        plaster: { basic: [6, 10], standard: [10, 15], premium: [15, 22] },
        plasterboards: { basic: [5, 8], standard: [8, 12], premium: [12, 18] },
        beads_tape: { basic: [2, 4], standard: [4, 7], premium: [7, 12] },
        electrical: {
          basic: [50, 80],
          standard: [80, 140],
          premium: [140, 250],
        },
        common_hardware: {
          basic: [40, 70],
          standard: [70, 120],
          premium: [120, 200],
        },
      };

      Object.entries(formData.materials.selected).forEach(
        ([itemId, config]) => {
          const prices = BALLPARK_PRICES[itemId];
          if (prices && prices[config.quality]) {
            const [priceLow, priceHigh] = prices[config.quality];
            const qty = config.quantity || 1;
            materialsLow += priceLow * qty;
            materialsHigh += priceHigh * qty;

            const itemLabel = itemId.replace(/_/g, " ");
            const qualityLabel =
              config.quality.charAt(0).toUpperCase() + config.quality.slice(1);
            materialsList.push(`${itemLabel} (${qualityLabel}, ${qty} units)`);
          }
        }
      );

      const contingencyMult = 1 + formData.materials.contingency / 100;
      materialsLow = Math.round((materialsLow * contingencyMult) / 5) * 5;
      materialsHigh = Math.round((materialsHigh * contingencyMult) / 5) * 5;
      materialsMid = Math.round((materialsLow + materialsHigh) / 2);
    } else if (
      formData.materials.mode === "custom" &&
      formData.materials.custom
    ) {
      const total = formData.materials.custom.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      materialsLow = materialsHigh = materialsMid = total;

      formData.materials.custom.forEach((item) => {
        materialsList.push(`${item.name} (£${item.amount})`);
      });
    }

    totalCostLow += materialsLow;
    totalCostHigh += materialsHigh;
  }

  // Design & Management
  let designManagement = 0;
  if (formData.designManagement && formData.designManagement !== "none") {
    const percentage = DESIGN_PERCENTAGES[formData.designManagement] || 0;
    const servicesMid = (totalCostLow + totalCostHigh) / 2;
    const dmBase = servicesMid + (materialsIncluded ? 0 : materialsMid);
    designManagement = Math.round((dmBase * percentage) / 100 / 5) * 5;
    totalCostLow += designManagement;
    totalCostHigh += designManagement;
  }

  const projectWeeks = Math.ceil(totalDaysHigh / 5);
  const durationDays = Math.ceil(totalDaysHigh);

  return {
    services,
    additionals,
    materialsLow,
    materialsHigh,
    materialsMid,
    materialsIncluded,
    materialsList,
    designManagement,
    totalDaysLow: Math.round(totalDaysLow * 10) / 10,
    totalDaysHigh: Math.round(totalDaysHigh * 10) / 10,
    durationDays,
    totalLow: totalCostLow,
    totalHigh: totalCostHigh,
    projectWeeks,
  };
}

export default function FinalQuoteStep({ formData }) {
  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const quote = calculateQuote(formData);
  const moduleDetails = generateModuleDetails(formData);

  const PropertyIcon = PROPERTY_ICONS[formData.propertyType] || Home;

  const validateForm = () => {
    const errors = {};

    if (!customerDetails.fullName.trim())
      errors.fullName = "Full name is required";
    if (!customerDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      errors.email = "Email is invalid";
    }
    if (!customerDetails.addressLine1.trim())
      errors.addressLine1 = "Address is required";
    if (!customerDetails.city.trim()) errors.city = "City/Town is required";
    if (!customerDetails.postcode.trim())
      errors.postcode = "Postcode is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Build internal email HTML
  function buildInternalEmailHTML() {
    return `
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> ${customerDetails.fullName}</p>
    <p><strong>Email:</strong> ${customerDetails.email}</p>
    <p><strong>Phone:</strong> ${customerDetails.phone || "Not provided"}</p>
    <p><strong>Address:</strong> ${customerDetails.addressLine1}, ${
      customerDetails.addressLine2 || ""
    }, ${customerDetails.city}, ${customerDetails.postcode}</p>
    <p><strong>Notes:</strong> ${customerDetails.notes || "None"}</p>

    <h3>Project Summary</h3>
    ${quote.services
      .map(
        (s, i) => `
        <p><strong>${escapeHtml(s.name)}:</strong>
 £${s.costLow} – £${s.costHigh}</p>
        ${
          moduleDetails[i]?.items?.length
            ? `<ul>${moduleDetails[i].items
                .map((d) => `<li>${d}</li>`)
                .join("")}</ul>`
            : ""
        }
      `
      )
      .join("")}
    
    <h3>Total Estimate</h3>
    <p><strong>Total:</strong> £${quote.totalLow} – £${quote.totalHigh}</p>
  `;
  }

  // Build customer confirmation email
  function buildCustomerEmailHTML() {
    return `
    <h2>Your EBS Estimate Request</h2>
    <p>Thank you, ${customerDetails.fullName}, for requesting a detailed quote.</p>
    <p>Here is a summary of your estimated project cost:</p>

    <h3>Total Estimate</h3>
    <p><strong>£${quote.totalLow} – £${quote.totalHigh}</strong></p>

    <p>We will contact you shortly to discuss your project in more detail.</p>
    <p>Best regards,<br/>Exceptional Building Services</p>
  `;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      customerEmail: customerDetails.email,
      customerName: customerDetails.fullName,
      internalEmailHtml: buildInternalEmailHTML(),
      customerEmailHtml: buildCustomerEmailHTML(),
    };

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email failed");

      setSubmitted(true);
    } catch (err) {
      console.error("Email error:", err);
      alert("EMAIL ERROR: " + err.message);
    }
  };

  const updateCustomerDetail = (field, value) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="theme-dark quote-screen">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C8A74A]/20 rounded-full mb-2">
          <CheckCircle2 className="w-6 h-6 text-[#C8A74A]" />
        </div>
        <h2 className="text-xl font-semibold text-[#C8A74A] mb-1">
          Your Project Estimate
        </h2>
        <p className="text-xs text-[#F5F5F5]">
          Based on your selections, here's your comprehensive quote
        </p>
      </div>

      {/* Total Cost Banner */}
      <Card className="bg-gradient-to-br from-[#C8A74A]/20 to-[#D8B85C]/20 border-[#C8A74A]/50 p-4 sm:p-5 mb-2 text-center">
        <p className="text-[#C8A74A] text-xs font-medium mb-1">
          ESTIMATED TOTAL COST
        </p>
        <div className="text-2xl sm:text-3xl font-bold text-[#C8A74A]">
          £{quote.totalLow.toLocaleString()} - £
          {quote.totalHigh.toLocaleString()}
        </div>
      </Card>

      {/* Disclaimer under total cost */}
      <div className="p-2 sm:p-3 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
        <p className="text-xs text-[#F5F5F5]">
          💡 This is an estimated quote. Final costs may vary based on specific
          requirements, site conditions, and material selections. All estimates
          subject to site survey.
        </p>
      </div>

      {/* Project Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
        <Card className="bg-[#151515] border-[#262626] p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#F5F5F5]">Duration</p>
              <p className="text-xs text-[#F5F5F5]">
                {quote.durationDays} days ({quote.projectWeeks} weeks)
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#151515] border-[#262626] p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <PropertyIcon className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#F5F5F5]">
                Property Type
              </p>
              <p className="text-xs text-[#F5F5F5] capitalize">
                {formData.propertyType?.replace("-", " ")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#151515] border-[#262626] p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <HardHat className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#F5F5F5]">Services</p>
              <p className="text-xs text-[#F5F5F5]">
                {formData.selectedServices.length} main services
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cost Breakdown with Details */}
      <Card className="bg-[#151515] border-[#262626] p-3 sm:p-4 mb-4">
        <h3 className="text-sm font-semibold text-[#C8A74A] mb-3 module-title">
          Cost Breakdown
        </h3>
        <div className="space-y-2 cost-breakdown" style={{ lineHeight: 1.3 }}>
          {quote.services.map((service, idx) => (
            <div
              key={idx}
              className="pb-2 border-b border-[#262626] last:border-0"
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-[#F5F5F5] font-medium">
                  {service.name}
                </span>
                <span className="text-sm font-semibold text-[#C8A74A]">
                  £{service.costLow.toLocaleString()} - £
                  {service.costHigh.toLocaleString()}
                </span>
              </div>
              {moduleDetails[idx] &&
                moduleDetails[idx].rooms &&
                moduleDetails[idx].rooms.length > 0 && (
                  <div className="ml-3 mt-2 space-y-2">
                    {moduleDetails[idx].rooms.map((room, i) => (
                      <div key={i} className="text-xs text-[#F5F5F5]">
                        <p className="font-semibold">• {room.title}</p>

                        <ul className="ml-3 space-y-0.5">
                          {getRoomBullets(moduleDetails[idx].module, room).map(
                            (line, liIndex) => (
                              <li key={liIndex} className="text-[#F5F5F5]/80">
                                • {line}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {quote.additionals.length > 0 && (
            <div className="pb-2 border-b border-[#262626]">
              <p className="text-sm text-[#F5F5F5] font-medium mb-1">
                Additional Services
              </p>
              <div className="ml-3 space-y-0.5">
                {quote.additionals.map((add, idx) => (
                  <p key={idx} className="text-xs text-[#F5F5F5] bullet">
                    • {add.name} (×{add.quantity}) — £
                    {add.total.toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          )}

          {quote.materialsIncluded && quote.materialsMid > 0 && (
            <div className="pb-2 border-b border-[#262626]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-[#F5F5F5] font-medium">
                  Materials
                </span>
                <span className="text-sm font-semibold text-[#C8A74A]">
                  {formData.materials.mode === "ballpark"
                    ? `£${quote.materialsLow.toLocaleString()} - £${quote.materialsHigh.toLocaleString()}`
                    : `£${quote.materialsMid.toLocaleString()}`}
                </span>
              </div>
              {quote.materialsList.length > 0 && (
                <div className="ml-3 space-y-0.5 mt-1">
                  {quote.materialsList.slice(0, 5).map((item, i) => (
                    <p key={i} className="text-xs text-[#F5F5F5] bullet">
                      • {item}
                    </p>
                  ))}
                  {quote.materialsList.length > 5 && (
                    <p className="text-xs text-[#F5F5F5] bullet">
                      • ...and {quote.materialsList.length - 5} more
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {quote.designManagement > 0 && (
            <div className="pb-2">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-[#F5F5F5] font-medium">
                  Design & Management
                </span>
                <span className="text-sm font-semibold text-[#C8A74A]">
                  £{quote.designManagement.toLocaleString()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#F5F5F5] bullet">
                  •{" "}
                  {formData.designManagement === "procurement"
                    ? "Procurement (7%)"
                    : formData.designManagement === "management_procurement"
                    ? "Management & Procurement (11%)"
                    : formData.designManagement === "full"
                    ? "Design, Management & Procurement (12%)"
                    : "Design & Management"}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Customer Details Form */}
      <Card className="bg-gradient-to-br from-[#151515] to-[#0E0E0E] border-[#C8A74A]/30 p-3 sm:p-4 mb-4">
        <h3 className="text-sm font-semibold text-[#C8A74A] mb-1">
          Your Details
        </h3>
        <p className="text-xs text-[#F5F5F5] mb-3">
          Enter your details to receive a comprehensive breakdown and schedule a
          consultation
        </p>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-green-400 mb-1">
              Request Submitted Successfully!
            </h4>
            <p className="text-sm text-[#F5F5F5]">
              Your detailed quote request has been submitted successfully. We'll
              be in touch soon.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label
                htmlFor="fullName"
                className="text-[#F5F5F5] mb-1 block text-xs"
              >
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={customerDetails.fullName}
                onChange={(e) =>
                  updateCustomerDetail("fullName", e.target.value)
                }
                className={`bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A] ${
                  validationErrors.fullName ? "border-red-500" : ""
                }`}
              />
              {validationErrors.fullName && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="email"
                  className="text-[#F5F5F5] mb-1 block text-xs"
                >
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={customerDetails.email}
                  onChange={(e) =>
                    updateCustomerDetail("email", e.target.value)
                  }
                  className={`bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A] ${
                    validationErrors.email ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-[#F5F5F5] mb-1 block text-xs"
                >
                  Phone <span className="text-[#F5F5F5]">(Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="07XXX XXXXXX"
                  value={customerDetails.phone}
                  onChange={(e) =>
                    updateCustomerDetail("phone", e.target.value)
                  }
                  className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="addressLine1"
                className="text-[#F5F5F5] mb-1 block text-xs"
              >
                Address Line 1 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="123 Main Street"
                value={customerDetails.addressLine1}
                onChange={(e) =>
                  updateCustomerDetail("addressLine1", e.target.value)
                }
                className={`bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A] ${
                  validationErrors.addressLine1 ? "border-red-500" : ""
                }`}
              />
              {validationErrors.addressLine1 && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.addressLine1}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="addressLine2"
                className="text-[#F5F5F5] mb-1 block text-xs"
              >
                Address Line 2{" "}
                <span className="text-[#F5F5F5]">(Optional)</span>
              </Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="Apartment, suite, etc."
                value={customerDetails.addressLine2}
                onChange={(e) =>
                  updateCustomerDetail("addressLine2", e.target.value)
                }
                className="bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="city"
                  className="text-[#F5F5F5] mb-1 block text-xs"
                >
                  City/Town <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="London"
                  value={customerDetails.city}
                  onChange={(e) => updateCustomerDetail("city", e.target.value)}
                  className={`bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A] ${
                    validationErrors.city ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.city && (
                  <p className="text-red-400 text-xs mt-1">
                    {validationErrors.city}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="postcode"
                  className="text-[#F5F5F5] mb-1 block text-xs"
                >
                  Postcode <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  placeholder="SW1A 1AA"
                  value={customerDetails.postcode}
                  onChange={(e) =>
                    updateCustomerDetail(
                      "postcode",
                      e.target.value.toUpperCase()
                    )
                  }
                  className={`bg-[#0E0E0E] border-[#262626] text-[#F5F5F5] h-9 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A] ${
                    validationErrors.postcode ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.postcode && (
                  <p className="text-red-400 text-xs mt-1">
                    {validationErrors.postcode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="notes"
                className="text-[#F5F5F5] mb-1 block text-xs"
              >
                Additional Notes for Your Quote{" "}
                <span className="text-[#F5F5F5]">(Optional)</span>
              </Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Tell us anything else about your project..."
                value={customerDetails.notes}
                onChange={(e) => updateCustomerDetail("notes", e.target.value)}
                className="w-full bg-[#0E0E0E] border border-[#262626] text-[#F5F5F5] rounded-md px-3 py-2 text-sm focus:border-[#C8A74A] focus:outline-none focus:ring-1 focus:ring-[#C8A74A]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-[#C8A74A] hover:bg-[#D8B85C] text-[#0E0E0E] font-semibold gap-2 h-10 text-sm touch-manipulation min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              Request Detailed Quote
            </Button>
          </div>
        )}
      </Card>

      {/* Disclaimer at bottom */}
      <div className="p-2 sm:p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
        <p className="text-xs text-[#F5F5F5]">
          💡 This is an estimated quote. Final costs may vary based on specific
          requirements, site conditions, and material selections. All estimates
          subject to site survey.
        </p>
      </div>
    </div>
  );
}

function formatValueLabel(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : null;
  if (value === 0 || value === "none") return null;
  return value;
}

function prettifyKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

/* =========================
   PAINTING FORMATTER
========================= */
function formatPaintingRoom(room) {
  const bullets = [];

  if (room.surfaces?.walls || room.surfaces?.ceiling) {
    bullets.push("Walls & ceiling painted");
  }
  if (room.coats > 1) bullets.push(`${room.coats} coats`);
  if (room.colours > 1) bullets.push(`${room.colours} colours`);
  if (room.wallpaperRemoval && room.wallpaperRemoval !== "none") {
    bullets.push(`Wallpaper removal (${room.wallpaperRemoval})`);
  }
  if (room.doors > 0) bullets.push(`${room.doors} door(s) painted`);
  if (room.windows > 0) bullets.push(`${room.windows} window(s) painted`);
  if (room.minorRepairs) bullets.push("Minor surface repairs included");

  return bullets;
}

/* =========================
   GENERIC ROOM FORMATTER
========================= */
function formatGenericRoom(room, whitelist = []) {
  return Object.entries(room)
    .filter(([key]) => !["title", "name"].includes(key))
    .map(([key, value]) => {
      const formatted = formatValueLabel(value);
      if (!formatted) return null;
      if (whitelist.length && !whitelist.includes(key)) return null;
      return `${prettifyKey(key)}: ${formatted}`;
    })
    .filter(Boolean);
}
