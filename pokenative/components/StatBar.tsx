import { StyleSheet, Text, View } from 'react-native';
import { withAlpha } from '../lib/color';

type Props = {
  label: string;
  value: number;
  max?: number;
  barColor?: string;
};

export function StatBar({ label, value, max = 200, barColor = '#D9B44A' }: Props) {
  const percent = Math.max(0.03, Math.min(1, value / max));
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent * 100}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 10,
  },
  label: {
    width: 56,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: withAlpha('#000000', 0.3),
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    width: 34,
    textAlign: 'right',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
