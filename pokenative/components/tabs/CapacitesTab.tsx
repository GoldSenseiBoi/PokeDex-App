import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LEARN_METHOD_LABELS_FR } from '../../constants/pokedex';
import { withAlpha } from '../../lib/color';
import type { MoveEntry, PokemonDetail } from '../../types/pokemon';
import { SegmentedControl } from '../SegmentedControl';

const METHOD_ORDER = ['level-up', 'machine', 'egg', 'tutor'];

type Props = {
  detail: PokemonDetail;
  movesByMethod: Record<string, MoveEntry[]>;
  movesLoading: Record<string, boolean>;
  onLoadMethod: (method: string) => void;
};

export function CapacitesTab({ detail, movesByMethod, movesLoading, onLoadMethod }: Props) {
  const availableMethods = useMemo(() => {
    const present = new Set(detail.rawMoves.map((m) => m.method));
    return METHOD_ORDER.filter((m) => present.has(m));
  }, [detail]);

  const [activeMethod, setActiveMethod] = useState(availableMethods[0] ?? 'level-up');

  useEffect(() => {
    onLoadMethod(activeMethod);
  }, [activeMethod, onLoadMethod]);

  const entries = movesByMethod[activeMethod];
  const isLoading = movesLoading[activeMethod];

  return (
    <View>
      <Text style={styles.sectionTitle}>Capacités</Text>
      {availableMethods.length > 0 ? (
        <SegmentedControl
          options={availableMethods.map((m) => ({ key: m, label: LEARN_METHOD_LABELS_FR[m] ?? m }))}
          value={activeMethod}
          onChange={setActiveMethod}
        />
      ) : null}

      <View style={styles.panel}>
        {isLoading && !entries ? <ActivityIndicator color="#FFFFFF" style={styles.spinner} /> : null}
        {!isLoading && (!entries || entries.length === 0) ? (
          <Text style={styles.empty}>Aucune capacité trouvée pour ce moyen.</Text>
        ) : null}
        {entries?.map((move, idx) => (
          <View key={`${move.nameFr}-${idx}`} style={[styles.row, idx === entries.length - 1 && styles.rowLast]}>
            <Text style={styles.moveName}>{move.nameFr}</Text>
            {typeof move.level === 'number' ? <Text style={styles.moveLevel}>Niv. {move.level}</Text> : null}
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
    marginBottom: 10,
  },
  panel: {
    backgroundColor: withAlpha('#000000', 0.28),
    borderRadius: 16,
    marginTop: 14,
    paddingHorizontal: 14,
  },
  spinner: {
    paddingVertical: 24,
  },
  empty: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  moveName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  moveLevel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
});
