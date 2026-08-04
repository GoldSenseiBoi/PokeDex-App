import { EGG_GROUP_FALLBACK_FR, GAME_THEMES, GameId } from '../constants/pokedex';
import { formatEvolutionTrigger, titleCaseFromSlug } from '../lib/format';
import type {
  Ability,
  EncounterGroup,
  EvolutionNode,
  MoveEntry,
  PokemonCardData,
  PokemonDetail,
  RawMoveRef,
} from '../types/pokemon';
import { get } from './pokeapi';

const VERSION_GROUP = 'scarlet-violet';

function frName(names: { language: { name: string }; name: string }[] | undefined, fallback: string): string {
  return names?.find((n) => n.language.name === 'fr')?.name ?? fallback;
}

function gameNameFr(versionName: string): string {
  const known = (GAME_THEMES as Record<string, { nameFr: string }>)[versionName];
  return known?.nameFr ?? titleCaseFromSlug(versionName);
}

function mapCard(pokemon: any, species: any): PokemonCardData {
  return {
    id: pokemon.id,
    nameFr: frName(species.names, titleCaseFromSlug(pokemon.name)),
    slug: pokemon.name,
    sprite: pokemon.sprites?.other?.['official-artwork']?.front_default ?? pokemon.sprites?.front_default ?? null,
    types: pokemon.types
      .slice()
      .sort((a: any, b: any) => a.slot - b.slot)
      .map((t: any) => t.type.name),
  };
}

function flattenMoves(pokemon: any): RawMoveRef[] {
  const result: RawMoveRef[] = [];
  for (const m of pokemon.moves) {
    const detail = m.version_group_details.find((d: any) => d.version_group.name === VERSION_GROUP);
    if (!detail) continue;
    result.push({
      name: m.move.name,
      url: m.move.url,
      method: detail.move_learn_method.name,
      level: detail.level_learned_at,
    });
  }
  return result;
}

// ---- Paldea dex list ----

let paldeaEntriesCache: { number: number; name: string }[] | null = null;

export async function getPaldeaEntries(): Promise<{ number: number; name: string }[]> {
  if (paldeaEntriesCache) return paldeaEntriesCache;
  const data = await get<any>('/pokedex/paldea');
  paldeaEntriesCache = data.pokemon_entries
    .slice()
    .sort((a: any, b: any) => a.entry_number - b.entry_number)
    .map((e: any) => ({ number: e.entry_number, name: e.pokemon_species.name }));
  return paldeaEntriesCache!;
}

// ---- Cards (grid) ----

const cardCache = new Map<string, PokemonCardData>();

export async function getPokemonCard(nameOrId: string | number): Promise<PokemonCardData> {
  const key = String(nameOrId);
  const cached = cardCache.get(key);
  if (cached) return cached;

  const [pokemon, species] = await Promise.all([
    get<any>(`/pokemon/${key}`),
    get<any>(`/pokemon-species/${key}`),
  ]);
  const card = mapCard(pokemon, species);
  cardCache.set(key, card);
  cardCache.set(card.slug, card);
  cardCache.set(String(card.id), card);
  return card;
}

// ---- Detail ----

const detailCache = new Map<string, PokemonDetail>();

export async function getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const key = String(nameOrId);
  const cached = detailCache.get(key);
  if (cached) return cached;

  const [pokemon, species] = await Promise.all([
    get<any>(`/pokemon/${key}`),
    get<any>(`/pokemon-species/${key}`),
  ]);
  const card = mapCard(pokemon, species);

  const abilities: Ability[] = await Promise.all(
    pokemon.abilities.map(async (a: any) => {
      const abilityData = await get<any>(a.ability.url).catch(() => null);
      return {
        nameFr: frName(abilityData?.names, titleCaseFromSlug(a.ability.name)),
        isHidden: a.is_hidden,
      };
    }),
  );

  // PokeAPI's French localization lags behind for the newest games — fall back to English
  // per-version when no French flavor text exists yet (common for recent Paldea species).
  const descriptionsByVersion: Record<string, string> = {};
  const descriptionsByVersionEn: Record<string, string> = {};
  for (const entry of species.flavor_text_entries) {
    if (entry.language.name !== 'fr' && entry.language.name !== 'en') continue;
    const versionName = entry.version.name;
    const bucket = entry.language.name === 'fr' ? descriptionsByVersion : descriptionsByVersionEn;
    if (!bucket[versionName]) {
      bucket[versionName] = entry.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }
  for (const versionName of Object.keys(descriptionsByVersionEn)) {
    if (!descriptionsByVersion[versionName]) descriptionsByVersion[versionName] = descriptionsByVersionEn[versionName];
  }

  const eggGroups = species.egg_groups.map(
    (g: any) => EGG_GROUP_FALLBACK_FR[g.name] ?? titleCaseFromSlug(g.name),
  );

  const detail: PokemonDetail = {
    ...card,
    genusFr: frName(species.genera, species.genera.find((g: any) => g.language.name === 'en')?.genus ?? ''),
    descriptionsByVersion,
    heightM: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    stats: pokemon.stats.map((s: any) => ({ key: s.stat.name, base: s.base_stat })),
    abilities,
    evolutionChainUrl: species.evolution_chain?.url ?? null,
    eggGroups,
    genderRate: species.gender_rate,
    eggCyclesSteps: typeof species.hatch_counter === 'number' ? (species.hatch_counter + 1) * 255 : null,
    baseFriendship: species.base_happiness ?? null,
    rawMoves: flattenMoves(pokemon),
    locationAreaEncountersUrl: pokemon.location_area_encounters,
  };
  detailCache.set(key, detail);
  detailCache.set(detail.slug, detail);
  detailCache.set(String(detail.id), detail);
  return detail;
}

// ---- Type filter ----

const typeCache = new Map<string, Set<string>>();

export async function getPokemonNamesByType(type: string): Promise<Set<string>> {
  const cached = typeCache.get(type);
  if (cached) return cached;
  const data = await get<any>(`/type/${type}`);
  const set = new Set<string>(data.pokemon.map((p: any) => p.pokemon.name));
  typeCache.set(type, set);
  return set;
}

// ---- Evolution chain ----

const evolutionCache = new Map<string, EvolutionNode>();

export async function getEvolutionChain(url: string): Promise<EvolutionNode> {
  const cached = evolutionCache.get(url);
  if (cached) return cached;
  const data = await get<any>(url);
  const root = await buildEvolutionNode(data.chain);
  evolutionCache.set(url, root);
  return root;
}

async function buildEvolutionNode(link: any): Promise<EvolutionNode> {
  const card = await getPokemonCard(link.species.name);
  const next = await Promise.all(
    link.evolves_to.map(async (child: any) => ({
      trigger: formatEvolutionTrigger(child.evolution_details?.[0]),
      node: await buildEvolutionNode(child),
    })),
  );
  return { id: card.id, nameFr: card.nameFr, sprite: card.sprite, next };
}

// ---- Moves ----

const moveNameCache = new Map<string, string>();

export async function getMoveNamesFr(moves: RawMoveRef[]): Promise<MoveEntry[]> {
  return Promise.all(
    moves.map(async (m) => {
      let nameFr = moveNameCache.get(m.url);
      if (!nameFr) {
        const data = await get<any>(m.url).catch(() => null);
        nameFr = frName(data?.names, titleCaseFromSlug(m.name));
        moveNameCache.set(m.url, nameFr);
      }
      return { nameFr, level: m.method === 'level-up' ? m.level : undefined };
    }),
  );
}

// ---- Encounters ----

export async function getEncounters(url: string | null): Promise<EncounterGroup[]> {
  if (!url) return [];
  const data = await get<any[]>(url).catch(() => []);
  return data.map((enc: any) => ({
    areaNameFr: titleCaseFromSlug(enc.location_area.name.replace(/-area$/, '')),
    versions: Array.from(new Set<string>(enc.version_details.map((v: any) => v.version.name))).map(gameNameFr),
  }));
}
