import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Movie } from "../types";

type MovieCardProps = {
  movie: Movie;
  onPress?: (movie: Movie) => void;
};

export function MovieCard({ movie, onPress }: MovieCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(movie)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: movie.posterUrl }} style={styles.poster} contentFit="cover" />
      <View style={styles.infoRow}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.menuIcon}>...</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
    minHeight: 218,
    borderRadius: 6,
    backgroundColor: "#050505",
    padding: 8,
    marginRight: 16,
  },
  pressed: {
    opacity: 0.78,
  },
  poster: {
    width: "100%",
    aspectRatio: 0.78,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
  },
  infoRow: {
    minHeight: 42,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
  },
  menuIcon: {
    color: "#d8d8d8",
    fontSize: 18,
    lineHeight: 14,
    transform: [{ rotate: "90deg" }],
  },
});
