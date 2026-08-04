import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { DexColors } from '../constants/pokedex';

type Props = {
  label: string;
  onPress: () => void;
  showInfo?: boolean;
};

export function FilterButton({ label, onPress, showInfo }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {showInfo && <Ionicons name="information-circle-outline" size={16} color={DexColors.textSecondary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: DexColors.pill,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: DexColors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
    flexShrink: 1,
  },
});
