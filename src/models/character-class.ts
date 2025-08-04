import { SpellId } from "./spell";

export type CharacterClass = {
  name: string;
  slug: ClassId;
  description: string;
};

export type ClassId =
  | "bard"
  | "cleric"
  | "druid"
  | "sorcerer"
  | "warlock"
  | "wizard";

export type SellsByClass = Record<ClassId, SpellId[]>;
