import React, { useMemo, useState } from "react";
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

/* =========================
   HELPERS
========================= */

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function roundTo5(n) {
  return Math.round((Number(n) || 0) / 5) * 5;
}
function round1(n) {
  return Math.round((Number(n) || 0) * 10) / 10;
}
function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function prettify(v) {
  if (!v) return "";
  return String(v).replace(/_/g, " ");
}

/* =========================
   PROPERTY / RATES
========================= */

const PROPERTY_MULTIPLIERS = {
  detached: 1.25,
  "semi-detached": 1.15,
  "end-terrace": 1.1,
  terrace: 1.0,
  bungalow: 1.1,
  flat: 0.85,
};

const PROPERTY_ICONS = {
  detached: Home,
  "semi-detached": Building2,
  "end-terrace": Building,
  terrace: Building,
  bungalow: Home,
  flat: Building,
};

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

/* =========================
   ROOM BULLETS DISPATCH
========================= */

function getRoomBullets(moduleName, room) {
  try {
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
  } catch {
    return [];
  }
}

/* =========================
   MODULE DETAILS (UI bullets)
========================= */

function generateModuleDetails(formData) {
  const details = [];

  // Kitchen
  if (formData.kitchen?.areas?.length) {
    const rooms = formData.kitchen.areas.filter(Boolean).map((area) => ({
      title: area.name || "Kitchen Area",
      size: area.size,
      worktop: area.worktop,
      splashback: !!area.splashback,
      electrical: area.requireElectricalAlterations ? area.electrics || [] : [],
      plumbing: area.requirePlumbingAlterations ? area.plumbing || [] : [],
      floorTiling: area.requireFloorTiling ? num(area.floorTilingArea) : null,
    }));
    details.push({ module: "Kitchen", rooms });
  }

  // Bathroom
  if (formData.bathroom?.rooms?.length) {
    const rooms = formData.bathroom.rooms.filter(Boolean).map((room) => ({
      title: room.name || "Bathroom / WC",
      size: room.size,
      layout: room.layout,
      fixtures: room.fixtures || [],
      wallTiling: room.wallTiling,
      floorTiling: !!room.floorTiling,
      tileSize: room.tileSize,
      electrical: room.requireElectricalAlterations ? room.electrics || [] : [],
      plumbing: room.requirePlumbingAlterations ? room.plumbing || [] : [],
      finishQuality: room.finishQuality,
      access: room.access,
    }));
    details.push({ module: "Bathroom / WC", rooms });
  }

  // Flooring
  if (formData.flooring?.areas?.length) {
    const rooms = formData.flooring.areas.filter(Boolean).map((area) => ({
      title: area.name || "Floor Area",
      type: area.type,
      area: num(area.area),
      subfloor: area.subfloor,
      layout: area.layout,
      pattern: area.pattern,
      finishQuality: area.finishQuality,
      removeOld: !!area.removeOld,
      trimDoors: num(area.trimDoors),
      fitSkirting: !!area.fitSkirting,
      wasteRemoval: !!area.wasteRemoval,
    }));
    details.push({ module: "Flooring & Tiling", rooms });
  }

  // Carpentry
  if (formData.carpentry?.areas?.length) {
    const rooms = formData.carpentry.areas.filter(Boolean).map((area) => ({
      title: area.name || "Carpentry Area",
      doorCount: num(area.doorCount),
      skirtingMetres: num(area.skirtingMetres),
      architraveMetres: num(area.architraveMetres),
      wardrobeMetres: num(area.wardrobeMetres),
      finishType: area.finishType,
      bespokeComplexity: area.bespokeComplexity,
    }));
    details.push({ module: "Carpentry & Joinery", rooms });
  }

  // Painting
  if (formData.painting?.rooms?.length) {
    const rooms = formData.painting.rooms.filter(Boolean).map((room) => ({
      title: room.name || "Room",
      type: room.type || "standard",
      size: room.size,
      surfaces: room.surfaces || {},
      coats: num(room.coats, 1),
      colours: num(room.colours, 1),
      wallpaperRemoval: room.wallpaperRemoval || "none",
      doors: num(room.doors),
      windows: num(room.windows),
      spindleCount: num(room.spindleCount),
      handrailsStringers: !!room.handrailsStringers,
      minorRepairs: !!room.minorRepairs,
      staircaseHeight: room.staircaseHeight,
    }));
    details.push({ module: "Painting & Decorating", rooms });
  }

  // Plastering
  if (formData.plastering?.areas?.length) {
    const rooms = formData.plastering.areas.filter(Boolean).map((area) => ({
      title: area.name || "Plastering Area",
      workType: area.workType,
      area: num(area.area),
      patchCount: num(area.patchCount),
      surfaceCondition: area.surfaceCondition,
      finishLevel: area.finishLevel,
      access: area.access,
    }));
    details.push({ module: "Plastering & Patching", rooms });
  }

  return details;
}

/* =========================
   QUOTE CALCULATION
========================= */

function calculateQuote(formData) {
  const propertyMultiplier = PROPERTY_MULTIPLIERS[formData.propertyType] || 1.0;

  const services = [];
  let totalDaysLow = 0;
  let totalDaysHigh = 0;
  let totalCostLow = 0;
  let totalCostHigh = 0;

  /* ---------- KITCHEN (room by room) ---------- */
  if (formData.kitchen?.areas?.length) {
    let totalKitchenDaysLowBase = 0;
    let totalKitchenDaysHighBase = 0;
    const roomBreakdown = [];

    formData.kitchen.areas.filter(Boolean).forEach((area) => {
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

      const floorTilingArea = num(area.floorTilingArea);
      if (area.requireFloorTiling && floorTilingArea > 0) {
        const tilingDays = Math.min(1 + floorTilingArea / 12, 2.0);
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

      totalKitchenDaysLowBase += baseDaysLow;
      totalKitchenDaysHighBase += baseDaysHigh;

      roomBreakdown.push({
        title: area.name || "Kitchen Area",
        lowBase: baseDaysLow,
        highBase: baseDaysHigh,
      });
    });

    const efficiency = RATES.standard.efficiency;
    const daily = RATES.standard.daily;

    const daysLow = totalKitchenDaysLowBase * efficiency * propertyMultiplier;
    const daysHigh = totalKitchenDaysHighBase * efficiency * propertyMultiplier;

    const costLow = roundTo5(daysLow * daily);
    const costHigh = roundTo5(daysHigh * daily);

    const roomsWithCost = roomBreakdown.map((r) => {
      const rLowDays = r.lowBase * efficiency * propertyMultiplier;
      const rHighDays = r.highBase * efficiency * propertyMultiplier;
      return {
        title: r.title,
        daysLow: round1(rLowDays),
        daysHigh: round1(rHighDays),
        costLow: roundTo5(rLowDays * daily),
        costHigh: roundTo5(rHighDays * daily),
      };
    });

    services.push({
      name: "Kitchen",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
      rooms: roomsWithCost,
    });

    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  /* ---------- BATHROOM (room by room) ---------- */
  if (formData.bathroom?.rooms?.length) {
    let totalDaysLowBase = 0;
    let totalDaysHighBase = 0;
    const roomBreakdown = [];

    formData.bathroom.rooms.filter(Boolean).forEach((room) => {
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
        { 0: 0, 25: 0.5, 50: 1.0, 75: 1.5, 100: 2.0 }[room.wallTiling] || 0;
      baseDaysLow += wallTilingAdd * 0.8;
      baseDaysHigh += wallTilingAdd;

      if (room.floorTiling) {
        baseDaysLow += 0.6;
        baseDaysHigh += 0.8;
      }

      const tileSizeMult =
        { small: 1.1, standard: 1.0, large: 1.1, slab: 1.25 }[room.tileSize] ||
        1.0;
      baseDaysLow *= tileSizeMult;
      baseDaysHigh *= tileSizeMult;

      const electricsAdd = (room.electrics?.length || 0) * 0.15;
      baseDaysLow += electricsAdd;
      baseDaysHigh += electricsAdd;

      const plumbingCount = room.plumbing?.length || 0;
      const plumbingComplexity =
        plumbingCount === 0
          ? "light"
          : plumbingCount <= 2
          ? "moderate"
          : "heavy";
      const plumbingMult = { light: 1.0, moderate: 1.1, heavy: 1.2 }[
        plumbingComplexity
      ];
      baseDaysLow *= plumbingMult;
      baseDaysHigh *= plumbingMult;

      const finishMult =
        { standard: 1.0, high: 1.08, premium: 1.15 }[room.finishQuality] || 1.0;
      baseDaysLow *= finishMult;
      baseDaysHigh *= finishMult;

      const accessMult =
        { easy: 1.0, stairs: 1.07, no_parking: 1.1 }[room.access] || 1.0;
      baseDaysLow *= accessMult;
      baseDaysHigh *= accessMult;

      totalDaysLowBase += baseDaysLow;
      totalDaysHighBase += baseDaysHigh;

      roomBreakdown.push({
        title: room.name || "Bathroom / WC",
        lowBase: baseDaysLow,
        highBase: baseDaysHigh,
      });
    });

    const efficiency = RATES.standard.efficiency;
    const daily = RATES.standard.daily;

    const daysLow = totalDaysLowBase * efficiency * propertyMultiplier;
    const daysHigh = totalDaysHighBase * efficiency * propertyMultiplier;

    const costLow = roundTo5(daysLow * daily);
    const costHigh = roundTo5(daysHigh * daily);

    const roomsWithCost = roomBreakdown.map((r) => {
      const rLowDays = r.lowBase * efficiency * propertyMultiplier;
      const rHighDays = r.highBase * efficiency * propertyMultiplier;
      return {
        title: r.title,
        daysLow: round1(rLowDays),
        daysHigh: round1(rHighDays),
        costLow: roundTo5(rLowDays * daily),
        costHigh: roundTo5(rHighDays * daily),
      };
    });

    services.push({
      name: "Bathroom / WC",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
      rooms: roomsWithCost,
    });

    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  /* ---------- FLOORING (room by room) ---------- */
  if (formData.flooring?.areas?.length) {
    let totalDaysLowBase = 0;
    let totalDaysHighBase = 0;
    const roomBreakdown = [];

    formData.flooring.areas.filter(Boolean).forEach((area) => {
      const areaM2 = num(area.area);
      if (!area.type || !areaM2) return;

      const speedsPerDay = {
        laminate: 18,
        lvt: 10,
        engineered_wood: 12,
        solid_wood: 8,
        carpet: 25,
        tiles: 8,
      };
      const baseSpeed = speedsPerDay[area.type] || 15;
      let baseDays = areaM2 / baseSpeed;

      const subfloorMult =
        { good: 1.0, uneven: 1.2, poor: 1.35 }[area.subfloor] || 1.0;
      baseDays *= subfloorMult;

      const layoutMult =
        { simple: 1.0, complex: 1.15, multiple: 1.25 }[area.layout] || 1.0;
      baseDays *= layoutMult;

      const patternMult =
        { straight: 1.0, diagonal: 1.15, herringbone: 1.35 }[area.pattern] ||
        1.0;
      baseDays *= patternMult;

      const finishMult =
        { standard: 1.0, high: 1.08, premium: 1.15 }[area.finishQuality] || 1.0;
      baseDays *= finishMult;

      if (area.removeOld) baseDays += 0.5;
      baseDays += num(area.trimDoors) * 0.1;
      if (area.fitSkirting) baseDays += 0.5;

      const lowBase = baseDays * 0.85;
      const highBase = baseDays * 1.15;

      totalDaysLowBase += lowBase;
      totalDaysHighBase += highBase;

      roomBreakdown.push({
        title: area.name || "Floor Area",
        lowBase,
        highBase,
        wasteRemoval: !!area.wasteRemoval,
      });
    });

    const efficiency = RATES.standard.efficiency;
    const daily = RATES.standard.daily;

    const daysLow = totalDaysLowBase * efficiency * propertyMultiplier;
    const daysHigh = totalDaysHighBase * efficiency * propertyMultiplier;

    const roomsWithCost = roomBreakdown.map((r) => {
      const rLowDays = r.lowBase * efficiency * propertyMultiplier;
      const rHighDays = r.highBase * efficiency * propertyMultiplier;

      let low = roundTo5(rLowDays * daily);
      let high = roundTo5(rHighDays * daily);

      if (r.wasteRemoval) {
        low += 100;
        high += 100;
      }

      return {
        title: r.title,
        daysLow: round1(rLowDays),
        daysHigh: round1(rHighDays),
        costLow: low,
        costHigh: high,
      };
    });

    const costLow = roomsWithCost.reduce((s, r) => s + (r.costLow || 0), 0);
    const costHigh = roomsWithCost.reduce((s, r) => s + (r.costHigh || 0), 0);

    services.push({
      name: "Flooring & Tiling",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
      rooms: roomsWithCost,
    });

    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  /* ---------- CARPENTRY (room by room) ---------- */
  if (formData.carpentry?.areas?.length) {
    let totalDaysLowBase = 0;
    let totalDaysHighBase = 0;
    const roomBreakdown = [];

    formData.carpentry.areas.filter(Boolean).forEach((area) => {
      let baseDays = 0;
      baseDays += num(area.doorCount) * 0.4;
      baseDays += num(area.skirtingMetres) / 15;
      baseDays += num(area.architraveMetres) / 15;
      baseDays += num(area.wardrobeMetres) * 0.6;
      baseDays += num(area.doorCount) * 0.05;

      const finishMult =
        { standard: 1.0, premium: 1.15, sprayed: 1.2 }[area.finishType] || 1.0;
      baseDays *= finishMult;

      const bespokeMult =
        {
          none: 1.0,
          simple: 1.0,
          moderate: 1.15,
          complex: 1.3,
        }[area.bespokeComplexity] || 1.0;
      baseDays *= bespokeMult;

      const lowBase = baseDays * 0.9;
      const highBase = baseDays * 1.1;

      totalDaysLowBase += lowBase;
      totalDaysHighBase += highBase;

      roomBreakdown.push({
        title: area.name || "Carpentry Area",
        lowBase,
        highBase,
      });
    });

    const efficiency = RATES.standard.efficiency;
    const daily = RATES.standard.daily;

    const daysLow = totalDaysLowBase * efficiency * propertyMultiplier;
    const daysHigh = totalDaysHighBase * efficiency * propertyMultiplier;

    const costLow = roundTo5(daysLow * daily);
    const costHigh = roundTo5(daysHigh * daily);

    const roomsWithCost = roomBreakdown.map((r) => {
      const rLowDays = r.lowBase * efficiency * propertyMultiplier;
      const rHighDays = r.highBase * efficiency * propertyMultiplier;
      return {
        title: r.title,
        daysLow: round1(rLowDays),
        daysHigh: round1(rHighDays),
        costLow: roundTo5(rLowDays * daily),
        costHigh: roundTo5(rHighDays * daily),
      };
    });

    services.push({
      name: "Carpentry & Joinery",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
      rooms: roomsWithCost,
    });

    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  /* ---------- PAINTING (room by room) ---------- */
  if (formData.painting?.rooms?.length) {
    let totalDays = 0;
    const roomBreakdown = [];

    formData.painting.rooms.filter(Boolean).forEach((room) => {
      let roomDays = 0;

      const baseDaysPerSurface = {
        small: { walls: 0.6, ceiling: 0.25, woodwork: 0.5 },
        medium: { walls: 0.8, ceiling: 0.3, woodwork: 0.6 },
        large: { walls: 1.2, ceiling: 0.4, woodwork: 0.8 },
      };

      const surfaceDays =
        baseDaysPerSurface[room.size] || baseDaysPerSurface.medium;
      if (room.surfaces?.walls) roomDays += surfaceDays.walls;
      if (room.surfaces?.ceiling) roomDays += surfaceDays.ceiling;
      if (room.surfaces?.woodwork) roomDays += surfaceDays.woodwork;

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
        roomDays += 0.02 * num(room.spindleCount);
        if (room.handrailsStringers) roomDays += 0.1;
      }

      const coats = num(room.coats, 1);
      const colours = num(room.colours, 1);
      if (coats > 1) roomDays *= 1 + 0.5 * (coats - 1);
      if (colours > 1) roomDays *= 1 + 0.05 * (colours - 1);

      if (room.minorRepairs) roomDays += 0.2;

      if (room.wallpaperRemoval !== "none" && room.surfaces?.walls) {
        const removalBaseDays =
          { small: 0.5, medium: 0.6, large: 0.9 }[room.size] || 0.6;
        const diffMult = {
          standard: 1.0,
          "heavy-duty": 1.35,
          "painted-over": 1.5,
        }[room.wallpaperRemoval];
        roomDays += removalBaseDays * (diffMult || 1);
      }

      roomDays += num(room.doors) * 0.1;
      roomDays += num(room.windows) * 0.08;

      totalDays += roomDays;

      roomBreakdown.push({
        title: room.name || "Room",
        days: round1(roomDays),
      });
    });

    const efficiency = RATES.economy.efficiency;
    const daily = RATES.economy.daily;

    const daysLow = totalDays * 0.9 * efficiency * propertyMultiplier;
    const daysHigh = totalDays * 1.1 * efficiency * propertyMultiplier;

    const costLow = roundTo5(daysLow * daily);
    const costHigh = roundTo5(daysHigh * daily);

    const roomsWithCost = roomBreakdown.map((r) => ({
      title: r.title,
      daysLow: r.days,
      daysHigh: r.days,
      costLow: roundTo5(r.days * daily * 0.9),
      costHigh: roundTo5(r.days * daily * 1.1),
    }));

    services.push({
      name: "Painting & Decorating",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
      rooms: roomsWithCost,
    });

    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  /* ---------- PLASTERING (room by room) ---------- */
  if (formData.plastering?.areas?.length) {
    let totalDaysLowBase = 0;
    let totalDaysHighBase = 0;
    const roomBreakdown = [];

    formData.plastering.areas.filter(Boolean).forEach((area) => {
      // ✅ Robust mapping: if your UI uses slightly different workType ids,
      // this will still calculate instead of returning 0.
      const workTypeRaw = String(area.workType || "").toLowerCase();

      const areaM2 = num(area.area);
      const patches = num(area.patchCount);

      const WORKTYPE_MAP = {
        patch: "patch",
        patching: "patch",
        patch_repair: "patch",

        reskim: "reskim",
        skim: "reskim",
        skimming: "reskim",

        reboard: "reboard",
        overboard: "reboard",
        reboarding: "reboard",
        boarding: "reboard",
        reboard_reskim: "reboard",

        artex: "artex",
        artex_cover: "artex",
        cover_artex: "artex",
      };

      const workType = WORKTYPE_MAP[workTypeRaw] || workTypeRaw;

      let baseDays = 0;

      if (workType === "patch") {
        baseDays = patches * 0.4;
      } else if (workType === "reskim") {
        baseDays = areaM2 / 27.5;
      } else if (workType === "reboard") {
        baseDays = areaM2 / 10;
      } else if (workType === "artex") {
        baseDays = (areaM2 / 27.5) * 1.4;
      } else {
        // ✅ Fail-safe: if unknown but area provided, assume reskim
        baseDays = areaM2 > 0 ? areaM2 / 27.5 : 0;
      }

      const conditionMult =
        { good: 1.0, fair: 1.1, poor: 1.25 }[area.surfaceCondition] || 1.0;
      baseDays *= conditionMult;

      const finishMult =
        { standard: 1.0, high: 1.08, premium: 1.15 }[area.finishLevel] || 1.0;
      baseDays *= finishMult;

      const accessMult =
        { easy: 1.0, stairs: 1.07, no_parking: 1.1 }[area.access] || 1.0;
      baseDays *= accessMult;

      const lowBase = baseDays * 0.9;
      const highBase = baseDays * 1.1;

      totalDaysLowBase += lowBase;
      totalDaysHighBase += highBase;

      roomBreakdown.push({
        title: area.name || "Plastering Area",
        lowBase,
        highBase,
      });
    });

    const efficiency = RATES.standard.efficiency;
    const daily = RATES.standard.daily;

    const daysLow = totalDaysLowBase * efficiency * propertyMultiplier;
    const daysHigh = totalDaysHighBase * efficiency * propertyMultiplier;

    const costLow = roundTo5(daysLow * daily);
    const costHigh = roundTo5(daysHigh * daily);

    const roomsWithCost = roomBreakdown.map((r) => {
      const rLowDays = r.lowBase * efficiency * propertyMultiplier;
      const rHighDays = r.highBase * efficiency * propertyMultiplier;
      return {
        title: r.title,
        daysLow: round1(rLowDays),
        daysHigh: round1(rHighDays),
        costLow: roundTo5(rLowDays * daily),
        costHigh: roundTo5(rHighDays * daily),
      };
    });

    services.push({
      name: "Plastering & Patching",
      daysLow,
      daysHigh,
      costLow,
      costHigh,
      rooms: roomsWithCost,
    });

    totalDaysLow += daysLow;
    totalDaysHigh += daysHigh;
    totalCostLow += costLow;
    totalCostHigh += costHigh;
  }

  /* ---------- ADDITIONALS ---------- */
  const additionals = [];
  let additionalsTotal = 0;

  if (Array.isArray(formData.additionals)) {
    formData.additionals.forEach((add) => {
      const total = num(add.price) * num(add.quantity);
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
        name: names[add.id] || add.id || "Additional",
        quantity: num(add.quantity),
        total,
      });
    });
  }

  totalCostLow += additionalsTotal;
  totalCostHigh += additionalsTotal;

  /* ---------- MATERIALS (custom only in this paste) ---------- */
  let materialsLow = 0;
  let materialsHigh = 0;
  let materialsMid = 0;
  let materialsIncluded = false;
  const materialsList = [];

  if (formData.materials?.includeInTotal) {
    materialsIncluded = true;

    if (
      formData.materials.mode === "custom" &&
      Array.isArray(formData.materials.custom)
    ) {
      const total = formData.materials.custom.reduce(
        (sum, item) => sum + num(item.amount),
        0
      );
      materialsLow = materialsHigh = materialsMid = total;

      formData.materials.custom.forEach((item) => {
        materialsList.push(`${item.name} (£${num(item.amount)})`);
      });

      totalCostLow += materialsLow;
      totalCostHigh += materialsHigh;
    }
  }

  /* ---------- DESIGN & MANAGEMENT ---------- */
  let designManagement = 0;
  if (formData.designManagement && formData.designManagement !== "none") {
    const percentage = DESIGN_PERCENTAGES[formData.designManagement] || 0;
    const servicesMid = (totalCostLow + totalCostHigh) / 2;
    const dmBase = servicesMid + (materialsIncluded ? 0 : materialsMid);
    designManagement = roundTo5((dmBase * percentage) / 100);
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
    totalDaysLow: round1(totalDaysLow),
    totalDaysHigh: round1(totalDaysHigh),
    durationDays,
    totalLow: totalCostLow,
    totalHigh: totalCostHigh,
    projectWeeks,
  };
}

/* =========================
   COMPONENT
========================= */

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

  const safeForm = formData || {};

  const quote = useMemo(() => calculateQuote(safeForm), [safeForm]);
  const moduleDetails = useMemo(
    () => generateModuleDetails(safeForm),
    [safeForm]
  );

  const PropertyIcon = PROPERTY_ICONS[safeForm?.propertyType] || Home;

  const validateForm = () => {
    const errors = {};
    if (!customerDetails.fullName.trim())
      errors.fullName = "Full name is required";
    if (!customerDetails.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(customerDetails.email))
      errors.email = "Email is invalid";
    if (!customerDetails.addressLine1.trim())
      errors.addressLine1 = "Address is required";
    if (!customerDetails.city.trim()) errors.city = "City/Town is required";
    if (!customerDetails.postcode.trim())
      errors.postcode = "Postcode is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ IMPORTANT FIX: do NOT rely on array index alignment (it breaks when user selects some services)
  function findModuleDetailsByServiceName(serviceName) {
    return moduleDetails.find((m) => m.module === serviceName);
  }

  // email HTML helper
  function renderRoomsHtml(serviceName, service) {
    const md = findModuleDetailsByServiceName(serviceName);
    if (!md?.rooms?.length) return "";

    return `
      <ul style="margin:8px 0 0 18px;">
        ${md.rooms
          .map((room, i) => {
            const calcRoom = service?.rooms?.[i];
            const roomPrice =
              calcRoom && calcRoom.costLow != null
                ? ` <span style="color:#C8A74A;">(£${calcRoom.costLow} – £${calcRoom.costHigh})</span>`
                : "";

            const bullets = getRoomBullets(md.module, room) || [];
            const bulletsHtml = bullets.length
              ? `<ul style="margin:6px 0 10px 18px;">
                  ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
                </ul>`
              : "";

            return `
              <li style="margin:0 0 8px 0;">
                <strong>${escapeHtml(
                  room.title || room.name || "Room"
                )}</strong>${roomPrice}
                ${bulletsHtml}
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  }

  // ✅ INTERNAL EMAIL: includes full breakdown + room bullets + room pricing (for any module that has service.rooms)
  function buildInternalEmailHTML() {
    return `
      <div style="font-family:Arial, sans-serif; line-height:1.45; color:#111;">
        <h2 style="margin:0 0 10px 0;">New Quote Request</h2>

        <p style="margin:0 0 4px 0;"><strong>Name:</strong> ${escapeHtml(
          customerDetails.fullName
        )}</p>
        <p style="margin:0 0 4px 0;"><strong>Email:</strong> ${escapeHtml(
          customerDetails.email
        )}</p>
        <p style="margin:0 0 4px 0;"><strong>Phone:</strong> ${escapeHtml(
          customerDetails.phone || "Not provided"
        )}</p>
        <p style="margin:0 0 4px 0;"><strong>Address:</strong> ${escapeHtml(
          customerDetails.addressLine1
        )}, ${escapeHtml(customerDetails.addressLine2 || "")} ${escapeHtml(
      customerDetails.city
    )}, ${escapeHtml(customerDetails.postcode)}</p>
        <p style="margin:0 0 10px 0;"><strong>Notes:</strong> ${escapeHtml(
          customerDetails.notes || "None"
        )}</p>

        <div style="height:1px; background:#ddd; margin:12px 0;"></div>

        <h3 style="margin:0 0 10px 0;">Project Summary</h3>

        ${quote.services
          .map(
            (s) => `
              <div style="margin:0 0 14px 0;">
                <p style="margin:0;">
                  <strong>${escapeHtml(s.name)}:</strong>
                  £${Number(s.costLow || 0).toLocaleString()} – £${Number(
              s.costHigh || 0
            ).toLocaleString()}
                </p>
                ${renderRoomsHtml(s.name, s)}
              </div>
            `
          )
          .join("")}

        <div style="height:1px; background:#ddd; margin:12px 0;"></div>

        <h3 style="margin:0 0 6px 0;">Total Estimate</h3>
        <p style="margin:0;"><strong>Total:</strong> £${Number(
          quote.totalLow || 0
        ).toLocaleString()} – £${Number(
      quote.totalHigh || 0
    ).toLocaleString()}</p>
      </div>
    `;
  }

  // ✅ CUSTOMER EMAIL: if you want the SAME breakdown as internal, just reuse it.
  // If you prefer a shorter one, keep your old summary version.
  function buildCustomerEmailHTML() {
    // Full breakdown email (same as internal)
    return `
      <div style="font-family:Arial, sans-serif; line-height:1.45; color:#111;">
        <h2 style="margin:0 0 10px 0;">Your EBS Estimate</h2>
        <p style="margin:0 0 10px 0;">Thank you, ${escapeHtml(
          customerDetails.fullName
        )}. Here is a breakdown of your estimate based on your selections.</p>

        <h3 style="margin:0 0 10px 0;">Estimate Breakdown</h3>

        ${quote.services
          .map(
            (s) => `
              <div style="margin:0 0 14px 0;">
                <p style="margin:0;">
                  <strong>${escapeHtml(s.name)}:</strong>
                  £${Number(s.costLow || 0).toLocaleString()} – £${Number(
              s.costHigh || 0
            ).toLocaleString()}
                </p>
                ${renderRoomsHtml(s.name, s)}
              </div>
            `
          )
          .join("")}

        <div style="height:1px; background:#ddd; margin:12px 0;"></div>

        <h3 style="margin:0 0 6px 0;">Total Estimate</h3>
        <p style="margin:0 0 10px 0;"><strong>£${Number(
          quote.totalLow || 0
        ).toLocaleString()} – £${Number(
      quote.totalHigh || 0
    ).toLocaleString()}</strong></p>

        <p style="margin:0 0 6px 0;">
          We’ll review your details and come back to you with a final fixed quote and availability after any required site checks.
        </p>

        <p style="margin:0;">
          Best regards,<br/>
          Exceptional Building Services
        </p>

        <p style="margin:10px 0 0 0; font-size:12px; color:#666;">
          Disclaimer: This is an estimate. Final costs may vary based on site conditions and exact specifications. Subject to site survey.
        </p>
      </div>
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
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
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

      <Card className="bg-gradient-to-br from-[#C8A74A]/20 to-[#D8B85C]/20 border-[#C8A74A]/50 p-4 sm:p-5 mb-2 text-center">
        <p className="text-[#C8A74A] text-xs font-medium mb-1">
          ESTIMATED TOTAL COST
        </p>
        <div className="text-2xl sm:text-3xl font-bold text-[#C8A74A]">
          £{Number(quote.totalLow || 0).toLocaleString()} - £
          {Number(quote.totalHigh || 0).toLocaleString()}
        </div>
      </Card>

      <div className="p-2 sm:p-3 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
        <p className="text-xs text-[#F5F5F5]">
          💡 This is an estimated quote. Final costs may vary based on specific
          requirements, site conditions, and material selections. All estimates
          subject to site survey.
        </p>
      </div>

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
                {safeForm?.propertyType?.replace("-", " ") || "—"}
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
                {safeForm?.selectedServices?.length || 0} main services
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
          {quote.services.map((service, idx) => {
            const md = findModuleDetailsByServiceName(service.name);

            return (
              <div
                key={idx}
                className="pb-2 border-b border-[#262626] last:border-0"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-[#F5F5F5] font-medium">
                    {service.name}
                  </span>
                  <span className="text-sm font-semibold text-[#C8A74A]">
                    £{Number(service.costLow || 0).toLocaleString()} - £
                    {Number(service.costHigh || 0).toLocaleString()}
                  </span>
                </div>

                {md?.rooms?.length > 0 && (
                  <div className="ml-3 mt-2 space-y-2">
                    {md.rooms.map((room, i) => {
                      const calcRoom = service.rooms?.[i];

                      return (
                        <div key={i} className="text-xs text-[#F5F5F5]">
                          <p className="font-semibold">
                            • {room.title}
                            {calcRoom && (
                              <span className="text-[#C8A74A] ml-1">
                                (£
                                {Number(calcRoom.costLow || 0).toLocaleString()}{" "}
                                – £
                                {Number(
                                  calcRoom.costHigh || 0
                                ).toLocaleString()}
                                )
                              </span>
                            )}
                          </p>

                          <ul className="ml-3 space-y-0.5">
                            {getRoomBullets(md.module, room).map(
                              (line, liIndex) => (
                                <li key={liIndex} className="text-[#F5F5F5]/80">
                                  • {line}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {quote.additionals.length > 0 && (
            <div className="pb-2 border-b border-[#262626]">
              <p className="text-sm text-[#F5F5F5] font-medium mb-1">
                Additional Services
              </p>
              <div className="ml-3 space-y-0.5">
                {quote.additionals.map((add, idx) => (
                  <p key={idx} className="text-xs text-[#F5F5F5]">
                    • {add.name} (×{add.quantity}) — £
                    {Number(add.total || 0).toLocaleString()}
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
                  £{Number(quote.materialsMid || 0).toLocaleString()}
                </span>
              </div>

              {quote.materialsList.length > 0 && (
                <div className="ml-3 space-y-0.5 mt-1">
                  {quote.materialsList.slice(0, 5).map((item, i) => (
                    <p key={i} className="text-xs text-[#F5F5F5]">
                      • {item}
                    </p>
                  ))}
                  {quote.materialsList.length > 5 && (
                    <p className="text-xs text-[#F5F5F5]">
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
                  £{Number(quote.designManagement || 0).toLocaleString()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#F5F5F5]">
                  •{" "}
                  {safeForm.designManagement === "procurement"
                    ? "Procurement (7%)"
                    : safeForm.designManagement === "management_procurement"
                    ? "Management & Procurement (11%)"
                    : safeForm.designManagement === "full"
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
                  placeholder="Bristol"
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
                  placeholder="BS1 1AA"
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

/* =========================
   FORMATTERS (PREVENT WHITE SCREEN)
========================= */

function formatPaintingRoom(room) {
  const bullets = [];
  if (room.surfaces?.walls || room.surfaces?.ceiling)
    bullets.push("Walls & ceiling painted");
  if (room.surfaces?.woodwork) bullets.push("Woodwork painted");
  if (num(room.coats, 1) > 1) bullets.push(`${num(room.coats, 1)} coats`);
  if (num(room.colours, 1) > 1) bullets.push(`${num(room.colours, 1)} colours`);
  if (room.wallpaperRemoval && room.wallpaperRemoval !== "none")
    bullets.push(`Wallpaper removal (${room.wallpaperRemoval})`);
  if (num(room.doors) > 0) bullets.push(`${num(room.doors)} door(s) painted`);
  if (num(room.windows) > 0)
    bullets.push(`${num(room.windows)} window(s) painted`);
  if (room.minorRepairs) bullets.push("Minor surface repairs included");
  return bullets;
}

function formatKitchenRoom(room) {
  const bullets = [];
  if (room.size) bullets.push(`Size: ${room.size}`);
  if (room.worktop) bullets.push(`Worktop: ${prettify(room.worktop)}`);
  if (room.splashback) bullets.push("Splashback included");
  if (room.electrical?.length)
    bullets.push(`Electrical changes: ${room.electrical.length} item(s)`);
  if (room.plumbing?.length)
    bullets.push(`Plumbing changes: ${room.plumbing.length} item(s)`);
  if (room.floorTiling)
    bullets.push(`Floor tiling: ${num(room.floorTiling)} m²`);
  return bullets;
}

function formatBathroomRoom(room) {
  const bullets = [];
  if (room.size) bullets.push(`Size: ${room.size}`);
  if (room.layout) bullets.push(`Layout: ${prettify(room.layout)}`);
  if (room.fixtures?.length)
    bullets.push(`Fixtures: ${room.fixtures.length} item(s)`);
  if (room.wallTiling != null) bullets.push(`Wall tiling: ${room.wallTiling}%`);
  if (room.floorTiling) bullets.push("Floor tiling included");
  if (room.tileSize) bullets.push(`Tile size: ${prettify(room.tileSize)}`);
  if (room.electrical?.length)
    bullets.push(`Electrical changes: ${room.electrical.length} item(s)`);
  if (room.plumbing?.length)
    bullets.push(`Plumbing changes: ${room.plumbing.length} item(s)`);
  if (room.finishQuality)
    bullets.push(`Finish: ${prettify(room.finishQuality)}`);
  if (room.access) bullets.push(`Access: ${prettify(room.access)}`);
  return bullets;
}

function formatFlooringRoom(room) {
  const bullets = [];
  if (room.type) bullets.push(`Type: ${prettify(room.type)}`);
  if (num(room.area) > 0) bullets.push(`Area: ${num(room.area)} m²`);
  if (room.subfloor) bullets.push(`Subfloor: ${prettify(room.subfloor)}`);
  if (room.layout) bullets.push(`Layout: ${prettify(room.layout)}`);
  if (room.pattern) bullets.push(`Pattern: ${prettify(room.pattern)}`);
  if (room.finishQuality)
    bullets.push(`Finish: ${prettify(room.finishQuality)}`);
  if (room.removeOld) bullets.push("Remove old flooring");
  if (num(room.trimDoors) > 0)
    bullets.push(`Trim doors: ${num(room.trimDoors)}`);
  if (room.fitSkirting) bullets.push("Fit skirting");
  if (room.wasteRemoval) bullets.push("Waste removal included");
  return bullets;
}

function formatCarpentryRoom(room) {
  const bullets = [];
  if (num(room.doorCount) > 0) bullets.push(`Doors: ${num(room.doorCount)}`);
  if (num(room.skirtingMetres) > 0)
    bullets.push(`Skirting: ${num(room.skirtingMetres)} m`);
  if (num(room.architraveMetres) > 0)
    bullets.push(`Architrave: ${num(room.architraveMetres)} m`);
  if (num(room.wardrobeMetres) > 0)
    bullets.push(`Wardrobes: ${num(room.wardrobeMetres)} m`);
  if (room.finishType) bullets.push(`Finish: ${prettify(room.finishType)}`);
  if (room.bespokeComplexity)
    bullets.push(`Bespoke: ${prettify(room.bespokeComplexity)}`);
  return bullets;
}

function formatPlasteringRoom(room) {
  const bullets = [];
  if (room.workType) bullets.push(`Work type: ${prettify(room.workType)}`);
  if (num(room.area) > 0) bullets.push(`Area: ${num(room.area)} m²`);
  if (num(room.patchCount) > 0)
    bullets.push(`Patches: ${num(room.patchCount)}`);
  if (room.surfaceCondition)
    bullets.push(`Condition: ${prettify(room.surfaceCondition)}`);
  if (room.finishLevel) bullets.push(`Finish: ${prettify(room.finishLevel)}`);
  if (room.access) bullets.push(`Access: ${prettify(room.access)}`);
  return bullets;
}
