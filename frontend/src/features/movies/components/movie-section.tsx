import { ScrollView, StyleSheet, Text, View } from "react-native";

import { MovieCard } from "./movie-card";
import { Movie } from "../types";

type MovieSectionProps = {
  title: string;
  movies: Movie[];
};

export function MovieSection({ title, movies }: MovieSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.viewAll}>view all</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {movies.map((movie) => (
          <MovieCard key={`${title}-${movie.id}`} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
  },
  heading: {
    color: "#f6f6f6",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
  },
  viewAll: {
    color: "#a7a7a7",
    fontSize: 12,
    lineHeight: 16,
  },
  list: {
    paddingRight: 8,
  },
});
