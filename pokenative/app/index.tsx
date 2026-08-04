import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterButton } from '../components/FilterButton';
import { PokemonCard } from '../components/PokemonCard';
import { SelectModal } from '../components/SelectModal';
import { Colors } from '../constants/color';
import { ALL_TYPES, DexColors, GAME_THEMES, GameId, TYPE_LABELS_FR } from '../constants/pokedex';
import { useGame } from '../contexts/GameContext';
import { usePaldeaList } from '../hooks/usePaldeaList';

export default function Index() {
  const { cards, loading, loadingMore, loadMore, typeFilter, setTypeFilter } = usePaldeaList();
  const { game, setGame } = useGame();
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);

  const gameTheme = GAME_THEMES[game];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Pokédex</Text>

      <View style={styles.filterRow}>
        <FilterButton label="Sélectionner le genre" showInfo onPress={() => setTypeModalVisible(true)} />
        <FilterButton label="Sélectionner le jeu" onPress={() => setGameModalVisible(true)} />
      </View>

      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: gameTheme.color }]}>
          <Text style={styles.pillText} numberOfLines={1}>
            {gameTheme.nameFr}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: gameTheme.color }]}>
          <Text style={styles.pillText} numberOfLines={1}>
            Paldea (Régional)
          </Text>
        </View>
      </View>

      {typeFilter ? (
        <View style={styles.activeFilterRow}>
          <Text style={styles.activeFilterText}>Type : {TYPE_LABELS_FR[typeFilter]}</Text>
          <Pressable onPress={() => setTypeFilter(null)} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={DexColors.textSecondary} />
          </Pressable>
        </View>
      ) : null}

      {loading && cards.length === 0 ? (
        <ActivityIndicator color="#FFFFFF" style={styles.loader} />
      ) : (
        <FlatList
          data={cards}
          numColumns={3}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PokemonCard data={item} onPress={() => router.push(`/pokemon/${item.id}`)} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#FFFFFF" style={styles.footerLoader} /> : null}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun Pokémon trouvé.</Text>}
        />
      )}

      <SelectModal
        visible={typeModalVisible}
        title="Sélectionner le genre"
        options={ALL_TYPES.map((t) => ({ key: t, label: TYPE_LABELS_FR[t], color: Colors.type[t] }))}
        selectedKey={typeFilter}
        onSelect={(key) => {
          setTypeFilter(key as (typeof ALL_TYPES)[number] | null);
          setTypeModalVisible(false);
        }}
        onClose={() => setTypeModalVisible(false)}
        clearLabel="Tous les types"
      />

      <SelectModal
        visible={gameModalVisible}
        title="Sélectionner le jeu"
        options={Object.entries(GAME_THEMES).map(([key, t]) => ({ key, label: t.nameFr, color: t.color }))}
        selectedKey={game}
        onSelect={(key) => {
          if (key) setGame(key as GameId);
          setGameModalVisible(false);
        }}
        onClose={() => setGameModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DexColors.background,
  },
  title: {
    color: DexColors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  pill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  activeFilterText: {
    color: DexColors.textSecondary,
    fontSize: 13,
  },
  loader: {
    marginTop: 40,
  },
  footerLoader: {
    marginVertical: 20,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 24,
  },
  emptyText: {
    color: DexColors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
