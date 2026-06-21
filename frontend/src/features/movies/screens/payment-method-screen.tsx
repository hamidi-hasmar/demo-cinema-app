import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { buildPaymentParams, formatPrice } from "./payment-utils";

export function PaymentMethodScreen() {
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
  const grandTotal = Number(paymentParams.grandTotal) || 0;

  function proceedToCard() {
    router.push({
      pathname: "/movies/booking/payment/card/[id]",
      params: paymentParams,
    });
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <SymbolView name="chevron.left" tintColor="#ffffff" size={26} />
          </Pressable>
          <Text style={styles.headerTitle}>Payment Method</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
          </View>

          <Text style={styles.prompt}>Select payment method</Text>

          <PaymentOption
            title="Credit / Debit Card"
            subtitle="Pay with Visa or Mastercard"
            selected
            onPress={proceedToCard}
          />
          <PaymentOption title="Online Banking" subtitle="Coming soon" disabled />
          <PaymentOption title="E-Wallet" subtitle="Coming soon" disabled />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.proceedButton} onPress={proceedToCard}>
            <Text style={styles.proceedText}>Proceed</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function PaymentOption({
  title,
  subtitle,
  selected = false,
  disabled = false,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={[styles.option, selected && styles.selectedOption, disabled && styles.disabledOption]}
      disabled={disabled}
      onPress={onPress}>
      <View style={styles.optionIcon}>
        <Text style={styles.optionIconText}>{title.charAt(0)}</Text>
      </View>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radioOuter, selected && styles.selectedRadio]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </Pressable>
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
    paddingBottom: 112,
    gap: 14,
  },
  totalBox: {
    minHeight: 96,
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  totalLabel: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "900",
  },
  totalValue: {
    color: "#080808",
    fontSize: 30,
    fontWeight: "900",
  },
  prompt: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 6,
  },
  option: {
    minHeight: 78,
    borderRadius: 4,
    backgroundColor: "#d8d8d8",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#ffffff",
  },
  disabledOption: {
    opacity: 0.55,
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 3,
    backgroundColor: "#8e8e8e",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
  optionTextBlock: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    color: "#080808",
    fontSize: 15,
    fontWeight: "900",
  },
  optionSubtitle: {
    color: "#626262",
    fontSize: 11,
    fontWeight: "800",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#555555",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#080808",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#080808",
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
  proceedButton: {
    width: "100%",
    maxWidth: 360,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
    alignItems: "center",
    justifyContent: "center",
  },
  proceedText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
});
