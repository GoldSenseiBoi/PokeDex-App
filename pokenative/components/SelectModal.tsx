import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { DexColors } from '../constants/pokedex';

export type SelectOption = {
  key: string;
  label: string;
  color?: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  onClose: () => void;
  clearLabel?: string;
};

export function SelectModal({ visible, title, options, selectedKey, onSelect, onClose, clearLabel }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={clearLabel ? [{ key: '__all__', label: clearLabel }, ...options] : options}
            keyExtractor={(item) => item.key}
            style={styles.list}
            renderItem={({ item }) => {
              const isSelected = item.key === '__all__' ? selectedKey === null : selectedKey === item.key;
              return (
                <Pressable
                  onPress={() => onSelect(item.key === '__all__' ? null : item.key)}
                  style={[styles.row, isSelected && styles.rowSelected]}
                >
                  {'color' in item && item.color ? <View style={[styles.dot, { backgroundColor: item.color }]} /> : null}
                  <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]}>{item.label}</Text>
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: DexColors.backgroundAlt,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  title: {
    color: DexColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DexColors.pill,
  },
  rowSelected: {
    opacity: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rowLabel: {
    color: DexColors.textSecondary,
    fontSize: 15,
  },
  rowLabelSelected: {
    color: DexColors.textPrimary,
    fontWeight: '700',
  },
});
