import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createBookingTransaction } from "../api/movie-api";
import { buildPaymentParams, formatPrice, parseConcessions } from "./payment-utils";

export function CardPaymentScreen() {
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
    concessionTotal?: string;
    grandTotal?: string;
    concessions?: string;
  }>();
  const paymentParams = buildPaymentParams(params);
  const concessions = useMemo(
    () => parseConcessions(paymentParams.concessions),
    [paymentParams.concessions],
  );
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const grandTotal = Number(paymentParams.grandTotal) || 0;

  const canPay =
    cardName.trim().length > 0 &&
    cardNumber.replace(/\D/g, "").length >= 12 &&
    expiry.trim().length > 0 &&
    cvv.replace(/\D/g, "").length >= 3 &&
    !isSubmitting;

  async function submitPayment() {
    if (!canPay) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const transaction = await createBookingTransaction({
        showtimeId: Number(paymentParams.showtimeId),
        ticketType: paymentParams.ticketType,
        location: paymentParams.location,
        cinemaHall: paymentParams.hall,
        showDate: paymentParams.date,
        startTime: paymentParams.time,
        seats: paymentParams.seats.split(",").filter(Boolean),
        concessions,
        ticketTotal: Number(paymentParams.ticketTotal) || 0,
        concessionTotal: Number(paymentParams.concessionTotal) || 0,
        grandTotal,
        paymentMethod: "CARD",
        cardNumber,
      });

      router.replace({
        pathname: "/movies/booking/payment/success/[id]",
        params: {
          id: paymentParams.id,
          reference: transaction.reference,
          amount: String(transaction.grandTotal),
          seats: paymentParams.seats,
          date: paymentParams.date,
          time: paymentParams.time,
          hall: paymentParams.hall,
        },
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to save booking transaction",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SymbolView name="chevron.left" tintColor="#ffffff" size={26} />
          </Pressable>
          <Text style={styles.headerTitle}>Card Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cardPreview}>
            <Text style={styles.previewLabel}>Credit / Debit Card</Text>
            <Text style={styles.previewNumber}>
              {cardNumber.trim().length > 0 ? cardNumber : "0000 0000 0000 0000"}
            </Text>
            <View style={styles.previewFooter}>
              <Text style={styles.previewName}>{cardName || "CARD HOLDER"}</Text>
              <Text style={styles.previewName}>{expiry || "MM/YY"}</Text>
            </View>
          </View>

          <View style={styles.formPanel}>
            <PaymentInput label="Name on Card" value={cardName} onChangeText={setCardName} />
            <PaymentInput
              label="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
              placeholder="0000 0000 0000 0000"
            />
            <View style={styles.inputRow}>
              <PaymentInput
                label="Expiry"
                value={expiry}
                onChangeText={setExpiry}
                placeholder="MM/YY"
              />
              <PaymentInput
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                placeholder="123"
              />
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>TOTAL</Text>
            <Text style={styles.footerTotal}>{formatPrice(grandTotal)}</Text>
          </View>
          <Pressable
            style={[styles.payButton, !canPay && styles.disabledButton]}
            disabled={!canPay}
            onPress={submitPayment}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.payText}>Pay Now</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function PaymentInput({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad";
  placeholder?: string;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#888888"
      />
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
    paddingBottom: 122,
    gap: 16,
  },
  cardPreview: {
    height: 178,
    borderRadius: 6,
    backgroundColor: "#111111",
    padding: 20,
    justifyContent: "space-between",
  },
  previewLabel: {
    color: "#d9d9d9",
    fontSize: 12,
    fontWeight: "900",
  },
  previewNumber: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  previewName: {
    color: "#d9d9d9",
    fontSize: 11,
    fontWeight: "900",
  },
  formPanel: {
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    padding: 16,
    gap: 14,
  },
  inputBlock: {
    flex: 1,
    gap: 7,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    color: "#333333",
    fontSize: 12,
    fontWeight: "900",
  },
  input: {
    height: 44,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    color: "#080808",
    fontSize: 14,
    fontWeight: "800",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
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
    justifyContent: "space-between",
    alignItems: "center",
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
  payButton: {
    width: 168,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.55,
  },
  payText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
});
