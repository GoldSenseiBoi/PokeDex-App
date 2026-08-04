import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { withAlpha } from '../../lib/color';
import type { EncounterGroup } from '../../types/pokemon';

type Props = {
  encounters: EncounterGroup[] | null;
  loading: boolean;
  onLoad: () => void;
};

export function EmplacementTab({ encounters, loading, onLoad }: Props) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Emplacement</Text>
      {loading && !encounters ? <ActivityIndicator color="#FFFFFF" style={styles.spinner} /> : null}
      {!loading && encounters && encounters.length === 0 ? (
        <Text style={styles.empty}>
          Non disponible à l&apos;état sauvage — ce Pokémon s&apos;obtient autrement (starter, cadeau, œuf, évolution…).
        </Text>
      ) : null}
      {encounters?.map((group, idx) => (
        <View key={`${group.areaNameFr}-${idx}`} style={styles.row}>
          <Text style={styles.areaName}>{group.areaNameFr}</Text>
          <Text style={styles.versions}>{group.versions.join(', ')}</Text>
        </View>
      ))}
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
  spinner: {
    marginTop: 30,
  },
  empty: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  row: {
    backgroundColor: withAlpha('#000000', 0.28),
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  areaName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  versions: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
});
