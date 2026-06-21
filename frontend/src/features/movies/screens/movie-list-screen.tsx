import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MovieSection } from "../components/movie-section";
import { useMovies } from "../hooks/use-movies";

const TAB_BAR_HEIGHT = Platform.select({ ios: 78, android: 82, web: 82, default: 0 });

export function MovieListScreen() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error, reload } = useMovies();

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) =>
      [movie.title, movie.genre, movie.language].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [movies, query]);

  const newReleases = filteredMovies.slice(0, 4);
  const popularMovies = [...filteredMovies].reverse().slice(0, 4);
  const recommendedMovies = filteredMovies.slice(1).concat(filteredMovies.slice(0, 1));

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.avatar} />
            <View style={styles.greeting}>
              <Text style={styles.hello}>
                Hello, <Text style={styles.name}>Raymond</Text>
              </Text>
              <Text style={styles.subtitle}>Want to go see a movie? Get your ticket today</Text>
            </View>
            <SymbolView name="bell" tintColor="#f4f4f4" size={24} />
          </View>

          <View style={styles.searchBar}>
            <SymbolView name="magnifyingglass" tintColor="#bebebe" size={22} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by movies or cinema hall"
              placeholderTextColor="#c4c4c4"
              style={styles.searchInput}
              autoCapitalize="none"
            />
            <SymbolView name="slider.horizontal.3" tintColor="#bebebe" size={22} />
          </View>

          {isLoading ? (
            <View style={styles.statePanel}>
              <ActivityIndicator color="#ffffff" />
            </View>
          ) : error ? (
            <View style={styles.statePanel}>
              <Text style={styles.stateText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={reload}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : filteredMovies.length === 0 ? (
            <View style={styles.statePanel}>
              <Text style={styles.stateText}>No movies found</Text>
            </View>
          ) : (
            <View style={styles.sections}>
              <MovieSection title="New Releases" movies={newReleases} />
              <MovieSection title="Popular in cinemas" movies={popularMovies} />
              <MovieSection title="Recommended for you" movies={recommendedMovies} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#030303",
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: TAB_BAR_HEIGHT + 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#d0d0d0",
  },
  greeting: {
    flex: 1,
    gap: 5,
  },
  hello: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "500",
  },
  name: {
    fontWeight: "800",
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
  },
  searchBar: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#4b4b4b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 18,
    paddingVertical: 0,
  },
  sections: {
    gap: 18,
  },
  statePanel: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  stateText: {
    color: "#f4f4f4",
    fontSize: 14,
    fontWeight: "700",
  },
  retryButton: {
    height: 40,
    minWidth: 104,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  retryText: {
    color: "#080808",
    fontSize: 14,
    fontWeight: "800",
  },
});
