import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { withAlpha } from '../lib/color';

export type DetailTabKey = 'description' | 'evolutions' | 'moves' | 'breeding' | 'locations';

const TABS: { key: DetailTabKey; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'description', label: 'Description', icon: 'newspaper-outline' },
  { key: 'evolutions', label: 'Évolutions', icon: 'git-branch-outline' },
  { key: 'moves', label: 'Capacités', icon: 'flash-outline' },
  { key: 'breeding', label: 'Reproduction', icon: 'heart-outline' },
  { key: 'locations', label: 'Emplacement', icon: 'location-outline' },
];

type Props = {
  active: DetailTabKey;
  onChange: (key: DetailTabKey) => void;
};

export function DetailTabBar({ active, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} onPress={() => onChange(tab.key)} style={styles.item}>
            <Ionicons name={tab.icon} size={20} color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} />
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: withAlpha('#000000', 0.45),
    paddingTop: 8,
    paddingBottom: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
