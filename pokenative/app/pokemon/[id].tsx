import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DetailTabBar, type DetailTabKey } from '../../components/DetailTabBar';
import { TypeBadge } from '../../components/TypeBadge';
import { CapacitesTab } from '../../components/tabs/CapacitesTab';
import { DescriptionTab } from '../../components/tabs/DescriptionTab';
import { EmplacementTab } from '../../components/tabs/EmplacementTab';
import { EvolutionsTab } from '../../components/tabs/EvolutionsTab';
import { ReproductionTab } from '../../components/tabs/ReproductionTab';
import { Colors } from '../../constants/color';
import { DexColors, GAME_THEMES } from '../../constants/pokedex';
import { useGame } from '../../contexts/GameContext';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { shade, withAlpha } from '../../lib/color';

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { game } = useGame();
  const {
    detail,
    loading,
    error,
    evolution,
    evolutionLoading,
    loadEvolution,
    movesByMethod,
    movesLoading,
    loadMoves,
    encounters,
    encountersLoading,
    loadEncounters,
  } = usePokemonDetail(id ?? '');
  const [activeTab, setActiveTab] = useState<DetailTabKey>('description');

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingSafe}>
        <Text style={styles.errorText}>Impossible de charger ce Pokémon.</Text>
      </SafeAreaView>
    );
  }

  const primaryType = detail.types[0];
  const accentColor = Colors.type[primaryType] ?? '#555555';
  const background = shade(accentColor, -0.55);
  const gameTheme = GAME_THEMES[game];

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <SafeAreaView style={styles.headerSafe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            <Text style={styles.headerLabel}>Pokédex</Text>
          </Pressable>
        </View>
        <Text style={styles.pokemonName} numberOfLines={1}>
          {detail.nameFr}
        </Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroRow}>
            {detail.sprite ? (
              <Image source={{ uri: detail.sprite }} style={styles.heroImage} resizeMode="contain" />
            ) : (
              <View style={styles.heroImage} />
            )}
            <View style={styles.badgeColumn}>
              {detail.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
              <View style={[styles.gamePill, { backgroundColor: gameTheme.color }]}>
                <Text style={styles.gamePillText} numberOfLines={1}>
                  {gameTheme.nameFr}
                </Text>
              </View>
            </View>
          </View>

          {activeTab === 'description' ? <DescriptionTab detail={detail} game={game} accentColor={accentColor} /> : null}
          {activeTab === 'evolutions' ? (
            <EvolutionsTab evolution={evolution} loading={evolutionLoading} onLoad={loadEvolution} currentId={detail.id} />
          ) : null}
          {activeTab === 'moves' ? (
            <CapacitesTab detail={detail} movesByMethod={movesByMethod} movesLoading={movesLoading} onLoadMethod={loadMoves} />
          ) : null}
          {activeTab === 'breeding' ? <ReproductionTab detail={detail} /> : null}
          {activeTab === 'locations' ? (
            <EmplacementTab encounters={encounters} loading={encountersLoading} onLoad={loadEncounters} />
          ) : null}
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.tabBarSafe}>
        <DetailTabBar active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingSafe: {
    flex: 1,
    backgroundColor: DexColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  screen: {
    flex: 1,
  },
  headerSafe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  pokemonName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 16,
  },
  heroImage: {
    width: 140,
    height: 140,
    backgroundColor: withAlpha('#000000', 0.15),
    borderRadius: 20,
  },
  badgeColumn: {
    flex: 1,
    gap: 10,
    alignItems: 'flex-start',
  },
  gamePill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  gamePillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  tabBarSafe: {
    backgroundColor: withAlpha('#000000', 0.45),
  },
});
