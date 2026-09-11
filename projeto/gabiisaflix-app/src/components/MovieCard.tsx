import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { Filme } from '@/constants/types';

type Props = {
  filme: Filme;
  onPress: (filme: Filme) => void;
};

function getPlatformColor(p: string): string {
  return Colors.platforms[p] ?? Colors.platforms.default;
}

function getPosterImage(poster: string | null) {
  if (!poster) {
    return undefined;
  }

  // Imagens antigas que já estão na pasta img
  switch (poster) {
    case 'img/tbm.jpg':
      return require('../../img/tbm.jpg');

    case 'img/cincopassos.jpg':
      return require('../../img/cincopassos.jpg');

    case 'img/hotel.webp':
      return require('../../img/hotel.webp');

    case 'img/curella.webp':
      return require('../../img/curella.webp');

    default:
      // Imagens novas vindas de URI ou do servidor
      return { uri: poster };
  }
}

export function MovieCard({ filme, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(filme)}
    >
      <View style={styles.card}>
        <Image
          source={getPosterImage(filme.poster_url)}
          style={styles.poster}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.overlay} />

        <View
          style={[
            styles.badge,
            {
              backgroundColor: getPlatformColor(
                filme.plataforma
              ),
            },
          ]}
        >
          <Text
            style={styles.badgeText}
            numberOfLines={1}
          >
            {filme.plataforma}
          </Text>
        </View>

        <View style={styles.info}>
          <Text
            style={styles.nome}
            numberOfLines={2}
          >
            {filme.nome}
          </Text>

          <Text
            style={styles.diretor}
            numberOfLines={1}
          >
            dir. {filme.diretor}
          </Text>

          {filme.nota !== null &&
            filme.nota !== undefined && (
              <Text style={styles.nota}>
                ★ {Number(filme.nota).toFixed(1)}
              </Text>
            )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxWidth: '50%',
    padding: Spacing.xs,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },

  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#1a1a1a',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  badge: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },

  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  info: {
    padding: Spacing.sm,
    gap: 3,
  },

  nome: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
    lineHeight: 18,
  },

  diretor: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },

  nota: {
    color: Colors.star,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: 2,
  },
});