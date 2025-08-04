import type { ClassId } from "src/models/character-class";

type AccentColorMap = {
  [key in ClassId]?: string;
};

export const ACCENT_COLOR: AccentColorMap = {
  bard: "#E47C4C", // orange-coral, less scarlet than warlock
  cleric: "#4C7FE4", // blue
  druid: "#228B22", // dark green
  sorcerer: "#E44C4C", // reddish-scarlet
  warlock: "#8E44AD", // dark purple
  wizard: "#3498DB", // light blue
};

export const DEFAULT_ACCENT_COLOR = "#d4af37";
