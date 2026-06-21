import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMovie } from "../hooks/use-movie";
import { Movie, MovieReview } from "../types";

type DetailTab = "details" | "reviews";

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

function formatReleaseDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function parseJsonArray<T>(value: string, fallback: T[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function genreChips(movie: Movie) {
  return movie.genre
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
}

export function MovieDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const movieId = params.id ? Number(params.id) : null;
  const { movie, isLoading, error, reload } = useMovie(movieId);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");

  const ratingBreakdown = useMemo(
    () => parseJsonArray<number>(movie?.ratingBreakdown ?? "[]", [0, 0, 0, 0, 0]),
    [movie?.ratingBreakdown],
  );
  const reviews = useMemo(
    () => parseJsonArray<MovieReview>(movie?.reviews ?? "[]", []),
    [movie?.reviews],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {isLoading ? (
          <View style={styles.statePanel}>
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : error || !movie ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateText}>{error ?? "Movie not found"}</Text>
            <Pressable style={styles.retryButton} onPress={reload}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}>
              <View style={styles.trailer}>
                <View style={styles.topBar}>
                  <Pressable onPress={() => router.back()} style={styles.iconButton}>
                    <SymbolView name="chevron.left" tintColor="#ffffff" size={26} />
                  </Pressable>
                  <SymbolView name="arrow.up.left.and.arrow.down.right" tintColor="#ffffff" size={22} />
                </View>
                <View style={styles.playButton}>
                  <SymbolView name="play.fill" tintColor="#ffffff" size={30} />
                </View>
                <View style={styles.trailerFooter}>
                  <Text style={styles.trailerBadge}>TRAILER</Text>
                  <SymbolView name="speaker.slash.fill" tintColor="#ffffff" size={20} />
                </View>
              </View>

              <View style={styles.detailPanel}>
                <View style={styles.summaryRow}>
                  <Image source={{ uri: movie.posterUrl }} style={styles.poster} contentFit="cover" />
                  <View style={styles.summaryText}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title} numberOfLines={3}>
                        {movie.title}
                      </Text>
                      <SymbolView name="heart" tintColor="#ffffff" size={22} />
                    </View>
                    <View style={styles.chips}>
                      {genreChips(movie).map((genre) => (
                        <Text key={genre} style={styles.chip}>
                          {genre}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>{formatReleaseDate(movie.releaseDate)}</Text>
                      <Text style={styles.metaText}>{movie.rating}</Text>
                      <Text style={styles.metaText}>{formatDuration(movie.durationMinutes)}</Text>
                    </View>
                    <Text style={styles.ratingLine}>
                      {movie.averageRating.toFixed(1)}/5 ({movie.reviewCount})
                    </Text>
                  </View>
                </View>

                <View style={styles.tabs}>
                  <Pressable style={styles.tabButton} onPress={() => setActiveTab("details")}>
                    <Text style={[styles.tabText, activeTab === "details" && styles.activeTabText]}>
                      Movie Details
                    </Text>
                    {activeTab === "details" && <View style={styles.activeTabIndicator} />}
                  </Pressable>
                  <Pressable style={styles.tabButton} onPress={() => setActiveTab("reviews")}>
                    <Text style={[styles.tabText, activeTab === "reviews" && styles.activeTabText]}>
                      Ratings & Reviews
                    </Text>
                    {activeTab === "reviews" && <View style={styles.activeTabIndicator} />}
                  </Pressable>
                </View>

                {activeTab === "details" ? (
                  <MovieDetails movie={movie} />
                ) : (
                  <RatingsAndReviews
                    averageRating={movie.averageRating}
                    reviewCount={movie.reviewCount}
                    ratingBreakdown={ratingBreakdown}
                    reviews={reviews}
                  />
                )}
              </View>
            </ScrollView>

            <View style={styles.bottomBar}>
              <Pressable style={styles.bookButton}>
                <Text style={styles.bookText}>Book Ticket</Text>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

function MovieDetails({ movie }: { movie: Movie }) {
  return (
    <View style={styles.detailsList}>
      <DetailRow title="Full synopsis" body={movie.synopsis} />
      <DetailRow title="Casts" body={movie.cast} />
      <DetailRow title="Director" body={movie.director} />
      <DetailRow title="Writers" body={movie.writers} />
    </View>
  );
}

function DetailRow({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailCopy}>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailBody} numberOfLines={title === "Full synopsis" ? 4 : 2}>
          {body}
        </Text>
      </View>
      <SymbolView name="chevron.right" tintColor="#ffffff" size={18} />
    </View>
  );
}

function RatingsAndReviews({
  averageRating,
  reviewCount,
  ratingBreakdown,
  reviews,
}: {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: number[];
  reviews: MovieReview[];
}) {
  const maxRatingCount = Math.max(...ratingBreakdown, 1);

  return (
    <View style={styles.reviewPanel}>
      <View style={styles.scoreHeader}>
        <Text style={styles.score}>{averageRating.toFixed(1)}</Text>
        <Text style={styles.reviewCount}>({reviewCount} Reviews)</Text>
      </View>

      <View style={styles.breakdown}>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <View key={rating} style={styles.breakdownRow}>
            <Text style={styles.breakdownStars}>{"*".repeat(rating)}</Text>
            <View style={styles.breakdownTrack}>
              <View
                style={[
                  styles.breakdownFill,
                  { width: `${(ratingBreakdown[index] / maxRatingCount) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.breakdownCount}>({ratingBreakdown[index] ?? 0})</Text>
          </View>
        ))}
      </View>

      <View style={styles.customerHeader}>
        <Text style={styles.customerTitle}>Customer Reviews</Text>
        <Text style={styles.seeAll}>see all</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {reviews.map((review) => (
          <View key={`${review.author}-${review.title}`} style={styles.reviewCard}>
            <Text style={styles.reviewStars}>{"*".repeat(review.rating)}</Text>
            <Text style={styles.reviewTitle}>{review.title}</Text>
            <Text style={styles.reviewBody} numberOfLines={3}>
              {review.comment}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#050505",
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
    paddingBottom: 112,
  },
  trailer: {
    height: 248,
    backgroundColor: "#a9a9a9",
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  trailerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 22,
  },
  trailerBadge: {
    color: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffffff",
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 13,
    fontWeight: "800",
  },
  detailPanel: {
    marginTop: -16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#070707",
    paddingTop: 28,
    paddingHorizontal: 24,
    minHeight: 520,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 14,
  },
  poster: {
    width: 120,
    height: 132,
    borderRadius: 4,
    backgroundColor: "#b0b0b0",
  },
  summaryText: {
    flex: 1,
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "900",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#7b7b7b",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaText: {
    color: "#bdbdbd",
    fontSize: 11,
    fontWeight: "700",
  },
  ratingLine: {
    color: "#dedede",
    fontSize: 12,
    fontWeight: "700",
  },
  tabs: {
    marginTop: 26,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2c",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "flex-end",
  },
  tabText: {
    color: "#a8a8a8",
    fontSize: 16,
    fontWeight: "800",
    paddingBottom: 10,
  },
  activeTabText: {
    color: "#ffffff",
  },
  activeTabIndicator: {
    height: 2,
    width: "58%",
    backgroundColor: "#ffffff",
  },
  detailsList: {
    paddingTop: 6,
  },
  detailRow: {
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2c",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailCopy: {
    flex: 1,
    gap: 8,
  },
  detailTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  detailBody: {
    color: "#bdbdbd",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
  },
  reviewPanel: {
    paddingTop: 14,
    gap: 14,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  score: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  reviewCount: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },
  breakdown: {
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2c",
    paddingBottom: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  breakdownStars: {
    width: 42,
    color: "#bdbdbd",
    fontSize: 11,
    fontWeight: "800",
  },
  breakdownTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  breakdownFill: {
    height: "100%",
    backgroundColor: "#a9a9a9",
  },
  breakdownCount: {
    width: 28,
    color: "#bdbdbd",
    fontSize: 11,
    fontWeight: "700",
  },
  customerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  seeAll: {
    color: "#a8a8a8",
    fontSize: 12,
    fontWeight: "700",
  },
  reviewCard: {
    width: 164,
    minHeight: 94,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  reviewStars: {
    color: "#a9a9a9",
    fontSize: 12,
    fontWeight: "900",
  },
  reviewTitle: {
    marginTop: 6,
    color: "#333333",
    fontSize: 10,
    fontWeight: "900",
  },
  reviewBody: {
    marginTop: 3,
    color: "#777777",
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "#070707",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 22,
  },
  bookButton: {
    width: "100%",
    maxWidth: 382,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#b0b0b0",
    alignItems: "center",
    justifyContent: "center",
  },
  bookText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
  statePanel: {
    flex: 1,
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  stateText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
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
