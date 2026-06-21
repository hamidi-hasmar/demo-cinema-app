import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

export function MovieBottomNav() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        <View style={styles.item}>
          <SymbolView name="house.fill" tintColor="#ffffff" size={24} />
          <Text style={styles.activeLabel}>Home</Text>
        </View>
        <View style={styles.item}>
          <SymbolView name="ticket.fill" tintColor="#b9b9b9" size={28} />
        </View>
        <View style={styles.item}>
          <SymbolView name="heart" tintColor="#b9b9b9" size={28} />
        </View>
        <View style={styles.item}>
          <SymbolView name="person" tintColor="#b9b9b9" size={27} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "rgba(3, 3, 3, 0.96)",
  },
  nav: {
    width: "100%",
    maxWidth: 430,
    height: 70,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    width: 54,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  activeLabel: {
    color: "#ffffff",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "800",
  },
});
