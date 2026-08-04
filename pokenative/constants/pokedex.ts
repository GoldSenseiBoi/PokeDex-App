// Dark theme tokens for the Pokédex screens (list + detail always render dark, regardless of system theme).
export const DexColors = {
  background: '#151517',
  backgroundAlt: '#1C1C1E',
  card: '#242426',
  cardAlt: '#2C2C2E',
  pill: '#3A3A3C',
  textPrimary: '#FFFFFF',
  textSecondary: '#A9A9AC',
  textMuted: '#7A7A7D',
};

export type PokemonType =
  | 'normal' | 'fighting' | 'flying' | 'poison' | 'ground' | 'rock'
  | 'bug' | 'ghost' | 'steel' | 'fire' | 'water' | 'grass'
  | 'electric' | 'psychic' | 'ice' | 'dragon' | 'dark' | 'fairy';

export const TYPE_LABELS_FR: Record<PokemonType, string> = {
  normal: 'Normal',
  fighting: 'Combat',
  flying: 'Vol',
  poison: 'Poison',
  ground: 'Sol',
  rock: 'Roche',
  bug: 'Insecte',
  ghost: 'Spectre',
  steel: 'Acier',
  fire: 'Feu',
  water: 'Eau',
  grass: 'Plante',
  electric: 'Électrik',
  psychic: 'Psy',
  ice: 'Glace',
  dragon: 'Dragon',
  dark: 'Ténèbres',
  fairy: 'Fée',
};

export const ALL_TYPES = Object.keys(TYPE_LABELS_FR) as PokemonType[];

export const STAT_LABELS_FR: Record<string, string> = {
  hp: 'Pv',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'Atk S.',
  'special-defense': 'Def S.',
  speed: 'Vit',
};

export const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

export type GameId = 'scarlet' | 'violet';

export const GAME_THEMES: Record<GameId, { nameFr: string; color: string; versionGroup: string }> = {
  scarlet: { nameFr: 'Écarlate', color: '#DC0A2D', versionGroup: 'scarlet-violet' },
  violet: { nameFr: 'Violet', color: '#7B3FA0', versionGroup: 'scarlet-violet' },
};

export const LEARN_METHOD_LABELS_FR: Record<string, string> = {
  'level-up': 'Niveau',
  machine: 'CT',
  egg: 'Œuf',
  tutor: 'Tuteur',
};

export const EGG_GROUP_FALLBACK_FR: Record<string, string> = {
  monster: 'Monstre',
  'water1': 'Aquatique 1',
  'water2': 'Aquatique 2',
  'water3': 'Aquatique 3',
  bug: 'Insecte',
  flying: 'Vol',
  ground: 'Amorphe',
  fairy: 'Fée',
  plant: 'Végétal',
  humanshape: 'Humanoïde',
  mineral: 'Minéral',
  indeterminate: 'Amorphe',
  grass: 'Végétal',
  dragon: 'Dragon',
  water: 'Aquatique',
  'no-eggs': 'Découverte',
  ditto: 'Ditto',
};
