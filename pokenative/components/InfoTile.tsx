import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { withAlpha } from '../lib/color';

type Props = {
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  primary: string;
  secondary?: string;
};

export function InfoTile({ iconName, primary, secondary }: Props) {
  return (
    <View style={styles.tile}>
      {iconName ? <Ionicons name={iconName} size={18} color="#FFFFFF" style={styles.icon} /> : null}
      <Text style={styles.primary} numberOfLines={2}>
        {primary}
      </Text>
      {secondary ? (
        <Text style={styles.secondary} numberOfLines={1}>
          {secondary}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: withAlpha('#000000', 0.28),
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 74,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.12),
  },
  icon: {
    marginBottom: 6,
  },
  primary: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  secondary: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
