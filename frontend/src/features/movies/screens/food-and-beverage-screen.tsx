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

import { useConcessionItems } from "../hooks/use-concession-items";
import { ConcessionItem, SelectedConcessionItem } from "../types";

function formatPrice(value: number) {
  return `RM ${(value / 100).toFixed(0)}`;
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export function FoodAndBeverageScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    ticketType?: string;
    location?: string;
    hall?: string;
    date?: string;
    time?: string;
    showtimeId?: string;
    seats?: string;
    ticketTotal?: string;
  }>();
  const movieId = readParam(params.id);
  const { items, isLoading, error, reload } = useConcessionItems();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const selectedItems = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          quantity: quantities[item.id] ?? 0,
        }))
        .filter((item) => item.quantity > 0),
    [items, quantities],
  );
  const foodTotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const selectedCount = selectedItems.reduce((total, item) => total + item.quantity, 0);

  function updateQuantity(itemId: number, direction: 1 | -1) {
    setQuantities((current) => {
      const nextQuantity = Math.max(0, (current[itemId] ?? 0) + direction);

      return {
        ...current,
        [itemId]: nextQuantity,
      };
    });
  }

  function proceedToSummary() {
    router.push({
      pathname: "/movies/booking/summary/[id]",
      params: {
        id: movieId,
        ticketType: readParam(params.ticketType),
        location: readParam(params.location),
        hall: readParam(params.hall),
        date: readParam(params.date),
        time: readParam(params.time),
        showtimeId: readParam(params.showtimeId),
        seats: readParam(params.seats),
        ticketTotal: readParam(params.ticketTotal),
        concessions: JSON.stringify(selectedItems),
      },
    });
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SymbolView name="chevron.left" tintColor="#ffffff" size={26} />
          </Pressable>
          <Text style={styles.headerTitle}>Food & Beverage</Text>
          <View style={styles.headerSpacer} />
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
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.prompt}>Select Food and Beverage</Text>

              <View style={styles.bookingStrip}>
                <View>
                  <Text style={styles.stripLabel}>Selected seats</Text>
                  <Text style={styles.stripValue}>{readParam(params.seats)}</Text>
                </View>
                <View style={styles.stripDivider} />
                <View>
                  <Text style={styles.stripLabel}>Time</Text>
                  <Text style={styles.stripValue}>{readParam(params.time)}</Text>
                </View>
              </View>

              <View style={styles.itemList}>
                {items.map((item) => (
                  <ConcessionCard
                    key={item.id}
                    item={item}
                    quantity={quantities[item.id] ?? 0}
                    onDecrease={() => updateQuantity(item.id, -1)}
                    onIncrease={() => updateQuantity(item.id, 1)}
                  />
                ))}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <View>
                <Text style={styles.footerLabel}>
                  {selectedCount > 0 ? `${selectedCount} ITEM(S)` : "NO ITEM SELECTED"}
                </Text>
                <Text style={styles.footerTotal}>{formatPrice(foodTotal)}</Text>
              </View>
              <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.proceedButton} onPress={proceedToSummary}>
                <Text style={styles.proceedText}>Proceed</Text>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

function ConcessionCard({
  item,
  quantity,
  onDecrease,
  onIncrease,
}: {
  item: ConcessionItem;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemThumb}>
        <Text style={styles.itemInitial}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable
          style={[styles.stepperButton, quantity === 0 && styles.disabledStepper]}
          disabled={quantity === 0}
          onPress={onDecrease}>
          <Text style={styles.stepperText}>-</Text>
        </Pressable>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Pressable style={styles.stepperButton} onPress={onIncrease}>
          <Text style={styles.stepperText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#3b3b3b",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 62,
    maxWidth: 430,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
  },
  headerSpacer: {
    width: 42,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 126,
  },
  prompt: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },
  bookingStrip: {
    minHeight: 64,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6a6a6a",
    backgroundColor: "#4a4a4a",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 18,
  },
  stripDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#777777",
  },
  stripLabel: {
    color: "#c8c8c8",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 5,
    textAlign: "center",
  },
  stripValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  itemList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  itemCard: {
    width: "48%",
    minHeight: 208,
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    padding: 10,
    justifyContent: "space-between",
  },
  itemThumb: {
    width: "100%",
    aspectRatio: 1.16,
    borderRadius: 3,
    backgroundColor: "#9a9a9a",
    alignItems: "center",
    justifyContent: "center",
  },
  itemInitial: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
  },
  itemInfo: {
    gap: 5,
    minHeight: 46,
  },
  itemName: {
    color: "#080808",
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "900",
  },
  itemPrice: {
    color: "#080808",
    fontSize: 12,
    fontWeight: "900",
  },
  stepper: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 3,
    backgroundColor: "#eeeeee",
    paddingHorizontal: 6,
  },
  stepperButton: {
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#3d3d3d",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledStepper: {
    opacity: 0.28,
  },
  stepperText: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "900",
  },
  quantityText: {
    minWidth: 24,
    color: "#080808",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "900",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#3b3b3b",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  footerLabel: {
    color: "#d2d2d2",
    fontSize: 10,
    fontWeight: "900",
  },
  footerTotal: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  cancelButton: {
    width: 96,
    height: 46,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#080808",
    fontSize: 15,
    fontWeight: "900",
  },
  proceedButton: {
    width: 118,
    height: 46,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
    alignItems: "center",
    justifyContent: "center",
  },
  proceedText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  statePanel: {
    flex: 1,
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
