import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { withAlpha } from '../../lib/color';
import type { EvolutionNode } from '../../types/pokemon';

type Props = {
  evolution: EvolutionNode | null;
  loading: boolean;
  onLoad: () => void;
  currentId: number;
};

export function EvolutionsTab({ evolution, loading, onLoad, currentId }: Props) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (loading && !evolution) {
    return <ActivityIndicator color="#FFFFFF" style={styles.spinner} />;
  }

  if (!evolution) {
    return <Text style={styles.empty}>Impossible de charger la chaîne d&apos;évolution.</Text>;
  }

  if (evolution.next.length === 0) {
    return <Text style={styles.empty}>Ce Pokémon n&apos;évolue pas.</Text>;
  }

  return (
    <View style={styles.container}>
      <EvolutionBranch node={evolution} currentId={currentId} />
    </View>
  );
}

function EvolutionBranch({ node, currentId }: { node: EvolutionNode; currentId: number }) {
  return (
    <View>
      <EvolutionStage node={node} isCurrent={node.id === currentId} />
      {node.next.map((edge, idx) => (
        <View key={`${node.id}-${idx}`} style={styles.edgeGroup}>
          <View style={styles.arrowRow}>
            <Ionicons name="arrow-down" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={styles.triggerText}>{edge.trigger}</Text>
          </View>
          <EvolutionBranch node={edge.node} currentId={currentId} />
        </View>
      ))}
    </View>
  );
}

function EvolutionStage({ node, isCurrent }: { node: EvolutionNode; isCurrent: boolean }) {
  return (
    <Pressable
      onPress={() => !isCurrent && router.push(`/pokemon/${node.id}`)}
      style={[styles.stageCard, isCurrent && styles.stageCardActive]}
    >
      {node.sprite ? <Image source={{ uri: node.sprite }} style={styles.stageSprite} resizeMode="contain" /> : null}
      <Text style={styles.stageName}>{node.nameFr}</Text>
      <Text style={styles.stageNumber}>#{String(node.id).padStart(3, '0')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  spinner: {
    marginTop: 40,
  },
  empty: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  stageCard: {
    backgroundColor: withAlpha('#000000', 0.28),
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  stageCardActive: {
    backgroundColor: withAlpha('#FFFFFF', 0.15),
  },
  stageSprite: {
    width: 80,
    height: 80,
  },
  stageName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    marginTop: 4,
  },
  stageNumber: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  edgeGroup: {
    alignItems: 'center',
    marginVertical: 6,
  },
  arrowRow: {
    alignItems: 'center',
    gap: 2,
  },
  triggerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
});
