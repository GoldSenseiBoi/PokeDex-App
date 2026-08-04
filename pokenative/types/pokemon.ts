import type { PokemonType } from '../constants/pokedex';

export interface PokemonCardData {
  id: number;
  nameFr: string;
  slug: string;
  sprite: string | null;
  types: PokemonType[];
}

export interface Ability {
  nameFr: string;
  isHidden: boolean;
}

export interface StatEntry {
  key: string;
  base: number;
}

export interface PokemonDetail extends PokemonCardData {
  genusFr: string;
  descriptionsByVersion: Record<string, string>;
  heightM: number;
  weightKg: number;
  stats: StatEntry[];
  abilities: Ability[];
  evolutionChainUrl: string | null;
  eggGroups: string[];
  genderRate: number; // -1 = genderless, else eighths female
  eggCyclesSteps: number | null;
  baseFriendship: number | null;
  rawMoves: RawMoveRef[];
  locationAreaEncountersUrl: string;
}

export interface RawMoveRef {
  name: string;
  url: string;
  method: string; // level-up | machine | egg | tutor
  level: number;
}

export interface MoveEntry {
  nameFr: string;
  level?: number;
}

export interface EvolutionNode {
  id: number;
  nameFr: string;
  sprite: string | null;
  next: { trigger: string; node: EvolutionNode }[];
}

export interface EncounterGroup {
  areaNameFr: string;
  versions: string[];
}
