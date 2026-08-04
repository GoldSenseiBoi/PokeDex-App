import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GAME_THEMES, GameId, STAT_LABELS_FR, STAT_ORDER } from '../../constants/pokedex';
import { withAlpha } from '../../lib/color';
import { getStatValue, StatMode } from '../../lib/statFormulas';
import type { PokemonDetail } from '../../types/pokemon';
import { InfoTile } from '../InfoTile';
import { SegmentedControl } from '../SegmentedControl';
import { StatBar } from '../StatBar';

type Props = {
  detail: PokemonDetail;
  game: GameId;
  accentColor: string;
};

export function DescriptionTab({ detail, game, accentColor }: Props) {
  const [statMode, setStatMode] = useState<StatMode>('base');
  const panelBg = withAlpha('#000000', 0.28);
  const gameTheme = GAME_THEMES[game];
  const description = detail.descriptionsByVersion[game]
    ?? Object.values(detail.descriptionsByVersion)[0]
    ?? 'Aucune description disponible.';

  const orderedStats = STAT_ORDER
    .map((key) => detail.stats.find((s) => s.key === key))
    .filter((s): s is PokemonDetail['stats'][number] => Boolean(s));

  return (
    <View>
      <Text style={styles.sectionTitle}>Pokémon {gameTheme.nameFr} description</Text>
      <View style={[styles.descriptionCard, { backgroundColor: gameTheme.color }]}>
        <View style={styles.descriptionSpriteFrame}>
          {detail.sprite ? <Image source={{ uri: detail.sprite }} style={styles.descriptionSprite} resizeMode="contain" /> : null}
        </View>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>

      <View style={styles.infoRow}>
        <InfoTile iconName="barbell-outline" primary={`${detail.weightKg} kg`} />
        <InfoTile iconName="resize-outline" primary={`${detail.heightM} m`} />
        <InfoTile primary={detail.genusFr || '—'} />
      </View>

      <Text style={styles.sectionTitle}>Stats</Text>
      <View style={[styles.panel, { backgroundColor: panelBg }]}>
        <SegmentedControl
          options={[
            { key: 'min', label: 'Min' },
            { key: 'base', label: 'Base' },
            { key: 'max', label: 'Max' },
          ]}
          value={statMode}
          onChange={(k) => setStatMode(k as StatMode)}
        />
        <View style={styles.statsList}>
          {orderedStats.map((stat) => (
            <StatBar
              key={stat.key}
              label={STAT_LABELS_FR[stat.key] ?? stat.key}
              value={getStatValue(stat.base, stat.key, statMode)}
              max={statMode === 'base' ? 180 : 420}
              barColor={accentColor}
            />
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Talents</Text>
      <View style={styles.talents}>
        {detail.abilities.map((ability) => (
          <View key={ability.nameFr + String(ability.isHidden)} style={[styles.talentPill, { backgroundColor: panelBg }]}>
            <Text style={styles.talentText}>
              {ability.nameFr}
              {ability.isHidden ? ' (Caché)' : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  descriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.25),
  },
  descriptionSpriteFrame: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: withAlpha('#FFFFFF', 0.16),
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionSprite: {
    width: 46,
    height: 46,
  },
  descriptionText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  panel: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.12),
  },
  statsList: {
    marginTop: 12,
  },
  talents: {
    gap: 10,
  },
  talentPill: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.14),
  },
  talentText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
