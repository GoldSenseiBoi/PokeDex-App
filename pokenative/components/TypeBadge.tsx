import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/color';
import { TYPE_LABELS_FR, type PokemonType } from '../constants/pokedex';

type Props = {
  type: PokemonType;
  size?: 'sm' | 'md';
};

export function TypeBadge({ type, size = 'md' }: Props) {
  const color = Colors.type[type] ?? '#777';
  return (
    <View style={[styles.badge, { backgroundColor: color }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.label, size === 'sm' && styles.labelSm]} numberOfLines={1}>
        {TYPE_LABELS_FR[type] ?? type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
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
