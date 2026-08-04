import { StyleSheet, Text, View } from 'react-native';
import { withAlpha } from '../../lib/color';
import type { PokemonDetail } from '../../types/pokemon';

type Props = {
  detail: PokemonDetail;
};

export function ReproductionTab({ detail }: Props) {
  const genderless = detail.genderRate < 0;
  const femalePercent = genderless ? null : (detail.genderRate / 8) * 100;
  const malePercent = genderless ? null : 100 - (femalePercent ?? 0);

  return (
    <View>
      <Text style={styles.sectionTitle}>Reproduction</Text>
      <View style={styles.panel}>
        <Row label="Groupe(s) d'Œufs" value={detail.eggGroups.join(', ') || '—'} />
        <Row
          label="Taux de genre"
          value={genderless ? 'Asexué' : `♂ ${malePercent?.toFixed(1)}%  /  ♀ ${femalePercent?.toFixed(1)}%`}
        />
        <Row
          label="Cycles d'éclosion"
          value={detail.eggCyclesSteps ? `≈ ${detail.eggCyclesSteps} pas` : '—'}
        />
        <Row label="Amitié de base" value={detail.baseFriendship != null ? String(detail.baseFriendship) : '—'} last />
      </View>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  panel: {
    backgroundColor: withAlpha('#000000', 0.28),
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    gap: 12,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    flexShrink: 1,
  },
  value: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'right',
    flexShrink: 1,
  },
});
