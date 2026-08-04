import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/color';
import { TYPE_LABELS_FR, type PokemonType } from '../constants/pokedex';
import { withAlpha } from '../lib/color';

type Props = {
  type: PokemonType;
  size?: 'sm' | 'md';
};

export function TypeBadge({ type, size = 'md' }: Props) {
  const color = Colors.type[type] ?? '#777';
  return (
    <View style={[styles.badge, { backgroundColor: color }, size === 'sm' && styles.badgeSm]}>
      <View style={[styles.dot, size === 'sm' && styles.dotSm]} />
      <Text style={[styles.label, size === 'sm' && styles.labelSm]} numberOfLines={1}>
        {TYPE_LABELS_FR[type] ?? type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.35),
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: withAlpha('#FFFFFF', 0.85),
  },
  dotSm: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  labelSm: {
    fontSize: 10,
  },
});
