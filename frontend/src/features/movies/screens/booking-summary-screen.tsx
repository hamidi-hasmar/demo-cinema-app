import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SelectedConcessionItem } from "../types";

function formatPrice(value: number) {
  return `RM ${(value / 100).toFixed(0)}`;
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function parseConcessions(value: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as SelectedConcessionItem[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BookingSummaryScreen() {
  const params = useLocalSearchParams<{
    ticketType?: string;
    location?: string;
    hall?: string;
    date?: string;
    time?: string;
    seats?: string;
    ticketTotal?: string;
    concessions?: string;
  }>();
  const ticketTotal = Number(readParam(params.ticketTotal)) || 0;
  const concessions = useMemo(
    () => parseConcessions(readParam(params.concessions)),
    [params.concessions],
  );
  const foodTotal = concessions.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const grandTotal = ticketTotal + foodTotal;
  const seats = readParam(params.seats);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SymbolView name="chevron.left" tintColor="#ffffff" size={26} />
          </Pressable>
          <Text style={styles.headerTitle}>Booking Summary</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.prompt}>Please confirm your booking details</Text>

          <View style={styles.ticketCard}>
            <View style={styles.posterBlock}>
              <Text style={styles.posterText}>TICKET</Text>
            </View>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketLabel}>{readParam(params.ticketType)}</Text>
              <Text style={styles.ticketMeta}>{readParam(params.location)}</Text>
              <Text style={styles.ticketMeta}>{readParam(params.hall)}</Text>
            </View>
          </View>

          <View style={styles.summaryPanel}>
            <SummaryRow label="Date" value={formatDate(readParam(params.date))} />
            <SummaryRow label="Time" value={readParam(params.time)} />
            <SummaryRow label="Seat" value={seats || "-"} />
            <SummaryRow label="Ticket" value={formatPrice(ticketTotal)} />
          </View>

          <View style={styles.summaryPanel}>
            <Text style={styles.panelTitle}>Food & Beverage</Text>
            {concessions.length === 0 ? (
              <SummaryRow label="No item selected" value={formatPrice(0)} />
            ) : (
              concessions.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>
                      {item.quantity} x {formatPrice(item.price)}
                    </Text>
                  </View>
                  <Text style={styles.itemAmount}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.totalPanel}>
            <SummaryRow label="Ticket Total" value={formatPrice(ticketTotal)} strong />
            <SummaryRow label="F&B Total" value={formatPrice(foodTotal)} strong />
            <View style={styles.totalDivider} />
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(grandTotal)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Back</Text>
          </Pressable>
          <Pressable style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirm</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, strong && styles.strongValue]}>{value}</Text>
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
    paddingBottom: 116,
    gap: 14,
  },
  prompt: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 2,
  },
  ticketCard: {
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    padding: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  posterBlock: {
    width: 92,
    height: 112,
    borderRadius: 3,
    backgroundColor: "#8f8f8f",
    alignItems: "center",
    justifyContent: "center",
  },
  posterText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },
  ticketInfo: {
    flex: 1,
    gap: 8,
  },
  ticketLabel: {
    color: "#080808",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
  },
  ticketMeta: {
    color: "#2f2f2f",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
  },
  summaryPanel: {
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    padding: 16,
    gap: 13,
  },
  panelTitle: {
    color: "#080808",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  summaryLabel: {
    flex: 1,
    color: "#666666",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  summaryValue: {
    flex: 1.25,
    color: "#080808",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    textAlign: "right",
  },
  strongValue: {
    fontSize: 15,
  },
  emptyText: {
    color: "#5c5c5c",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    color: "#080808",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
  },
  itemQuantity: {
    color: "#656565",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
  },
  itemAmount: {
    color: "#080808",
    fontSize: 13,
    fontWeight: "900",
  },
  totalPanel: {
    borderRadius: 4,
    backgroundColor: "#4a4a4a",
    borderWidth: 1,
    borderColor: "#6a6a6a",
    padding: 16,
    gap: 13,
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#5b5b5b",
  },
  grandTotalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  grandTotalLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  grandTotalValue: {
    color: "#ffffff",
    fontSize: 24,
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
    justifyContent: "center",
    gap: 14,
  },
  cancelButton: {
    flex: 1,
    maxWidth: 178,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#080808",
    fontSize: 18,
    fontWeight: "900",
  },
  confirmButton: {
    flex: 1,
    maxWidth: 178,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
});
