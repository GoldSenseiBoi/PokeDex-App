import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../constants/color';
import { TYPE_LABELS_FR } from '../constants/pokedex';
import { shade, withAlpha } from '../lib/color';
import type { PokemonCardData } from '../types/pokemon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  data: PokemonCardData;
  onPress: () => void;
};

export function PokemonCard({ data, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const primaryType = data.types[0];
  const typeColor = Colors.type[primaryType] ?? '#555555';
  const gradientTop = shade(typeColor, 0.22);
  const gradientBottom = shade(typeColor, -0.5);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 16, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      }}
      style={[styles.wrapper, animatedStyle]}
    >
      <LinearGradient colors={[gradientTop, gradientBottom]} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }} style={styles.card}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{String(data.id).padStart(3, '0')}</Text>
        </View>

        <View style={styles.artWindow}>
          {data.sprite ? (
            <Image source={{ uri: data.sprite }} style={styles.sprite} resizeMode="contain" />
          ) : (
            <View style={styles.sprite} />
          )}
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {data.nameFr}
        </Text>

        <View style={[styles.typePill, { backgroundColor: typeColor }]}>
          <View style={styles.typeDot} />
          <Text style={styles.typeLabel} numberOfLines={1}>
            {TYPE_LABELS_FR[primaryType] ?? primaryType}
          </Text>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
    minHeight: 172,
    borderWidth: 1.5,
    borderColor: withAlpha('#FFFFFF', 0.28),
    overflow: 'hidden',
  },
  numberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: withAlpha('#000000', 0.35),
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.25),
  },
  numberText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '700',
  },
  artWindow: {
    backgroundColor: withAlpha('#FFFFFF', 0.14),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.22),
    marginVertical: 8,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: '86%',
    height: '86%',
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 999,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.3),
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: withAlpha('#FFFFFF', 0.85),
  },
  typeLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
