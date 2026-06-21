import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatPrice, readParam } from "./payment-utils";

export function PaymentSuccessScreen() {
  const params = useLocalSearchParams<{
    reference?: string;
    amount?: string;
    seats?: string;
    date?: string;
    time?: string;
    hall?: string;
  }>();
  const amount = Number(readParam(params.amount)) || 0;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Text style={styles.successMark}>✓</Text>
          </View>
          <Text style={styles.title}>Payment Successful</Text>
          <Text style={styles.subtitle}>Your booking has been confirmed</Text>

          <View style={styles.receiptPanel}>
            <ReceiptRow label="Reference No." value={readParam(params.reference)} />
            <ReceiptRow label="Amount Paid" value={formatPrice(amount)} />
            <ReceiptRow label="Seat" value={readParam(params.seats)} />
            <ReceiptRow label="Hall" value={readParam(params.hall)} />
            <ReceiptRow label="Time" value={readParam(params.time)} />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.doneButton} onPress={() => router.replace("/")}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={styles.receiptValue}>{value || "-"}</Text>
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
  content: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingHorizontal: 24,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  successIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#d8d8d8",
    alignItems: "center",
    justifyContent: "center",
  },
  successMark: {
    color: "#080808",
    fontSize: 48,
    fontWeight: "900",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#d4d4d4",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  receiptPanel: {
    width: "100%",
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    padding: 16,
    gap: 13,
    marginTop: 12,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  receiptLabel: {
    flex: 1,
    color: "#666666",
    fontSize: 12,
    fontWeight: "800",
  },
  receiptValue: {
    flex: 1.2,
    color: "#080808",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
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
    alignItems: "center",
  },
  doneButton: {
    width: "100%",
    maxWidth: 360,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
});
