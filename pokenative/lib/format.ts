export function titleCaseFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

type EvolutionDetail = {
  item: { name: string } | null;
  trigger: { name: string } | null;
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  known_move_type: { name: string } | null;
  location: { name: string } | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  time_of_day: string;
  trade_species: { name: string } | null;
  turn_upside_down: boolean;
};

// Best-effort French phrasing of a PokeAPI evolution_details entry — covers the common triggers,
// falls back to the raw trigger name for exotic/rare ones.
export function formatEvolutionTrigger(detail: EvolutionDetail | undefined): string {
  if (!detail) return 'Condition inconnue';

  const parts: string[] = [];

  if (detail.min_level) parts.push(`Niveau ${detail.min_level}`);
  if (detail.item) parts.push(`Objet : ${titleCaseFromSlug(detail.item.name)}`);
  if (detail.held_item) parts.push(`Tient : ${titleCaseFromSlug(detail.held_item.name)}`);
  if (detail.known_move) parts.push(`Connaît : ${titleCaseFromSlug(detail.known_move.name)}`);
  if (detail.known_move_type) parts.push(`Capacité de type ${titleCaseFromSlug(detail.known_move_type.name)}`);
  if (detail.min_happiness) parts.push('Bonheur élevé');
  if (detail.min_affection) parts.push('Affection élevée');
  if (detail.min_beauty) parts.push('Beauté élevée');
  if (detail.time_of_day) parts.push(detail.time_of_day === 'day' ? 'Le jour' : 'La nuit');
  if (detail.location) parts.push(`À : ${titleCaseFromSlug(detail.location.name)}`);
  if (detail.trade_species) parts.push(`Échange contre ${titleCaseFromSlug(detail.trade_species.name)}`);
  if (detail.needs_overworld_rain) parts.push('Sous la pluie');
  if (detail.turn_upside_down) parts.push('Console retournée');

  if (parts.length === 0 && detail.trigger) {
    switch (detail.trigger.name) {
      case 'trade': return 'Échange';
      case 'shed': return 'Place libre dans l\'équipe + Ball libre';
      case 'other': return 'Condition spéciale';
      default: return titleCaseFromSlug(detail.trigger.name);
    }
  }

  return parts.join(' + ') || 'Condition spéciale';
}
