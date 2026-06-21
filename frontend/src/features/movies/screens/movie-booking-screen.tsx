import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMovieBookingOptions } from "../hooks/use-movie-booking-options";
import { useSeatLocks } from "../hooks/use-seat-locks";
import {
  BookingDate,
  BookingHall,
  BookingLocation,
  BookingTicketType,
  BookingTime,
} from "../types";

function formatPrice(value: number) {
  return `RM ${(value / 100).toFixed(0)}`;
}

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return {
    weekday: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date),
    day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en", { month: "long" }).format(date),
  };
}

export function MovieBookingScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const movieId = params.id ? Number(params.id) : null;
  const { bookingOptions, isLoading, error, reload } = useMovieBookingOptions(movieId);

  const [selectedTicketType, setSelectedTicketType] = useState<BookingTicketType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<BookingLocation | null>(null);
  const [selectedHall, setSelectedHall] = useState<BookingHall | null>(null);
  const [selectedDate, setSelectedDate] = useState<BookingDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<BookingTime | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isHallOpen, setIsHallOpen] = useState(false);

  useEffect(() => {
    if (!bookingOptions) {
      return;
    }

    setSelectedTicketType(bookingOptions.ticketTypes[0] ?? null);
    setSelectedLocation(bookingOptions.locations[0] ?? null);
  }, [bookingOptions]);

  useEffect(() => {
    setSelectedHall(selectedLocation?.halls[0] ?? null);
  }, [selectedLocation]);

  useEffect(() => {
    setSelectedDate(selectedHall?.dates[0] ?? null);
  }, [selectedHall]);

  useEffect(() => {
    setSelectedTime(selectedDate?.times[0] ?? null);
  }, [selectedDate]);

  const availableDates = selectedHall?.dates ?? [];
  const availableTimes = selectedDate?.times ?? [];
  const selectedShowtimeId = selectedTime?.id ?? null;
  const {
    clientId,
    locks: seatLocks,
    error: seatError,
    toggleSeat,
  } = useSeatLocks(selectedShowtimeId);
  const selectedSeatNumbers = useMemo(
    () =>
      seatLocks
        .filter((lock) => lock.lockedBy === clientId)
        .map((lock) => lock.seatNumber)
        .sort(),
    [clientId, seatLocks],
  );
  const monthLabel = useMemo(
    () => (selectedDate ? formatDateLabel(selectedDate.date).month : ""),
    [selectedDate],
  );

  const canProceed = Boolean(
    selectedTicketType &&
      selectedLocation &&
      selectedHall &&
      selectedDate &&
      selectedTime &&
      selectedSeatNumbers.length > 0,
  );

  function proceedToFoodAndBeverage() {
    if (
      !movieId ||
      !selectedTicketType ||
      !selectedLocation ||
      !selectedHall ||
      !selectedDate ||
      !selectedTime ||
      selectedSeatNumbers.length === 0
    ) {
      return;
    }

    router.push({
      pathname: "/movies/booking/food-and-beverage/[id]",
      params: {
        id: String(movieId),
        ticketType: selectedTicketType.label,
        location: selectedLocation.name,
        hall: selectedHall.name,
        date: selectedDate.date,
        time: selectedTime.startTime,
        showtimeId: String(selectedTime.id),
        seats: selectedSeatNumbers.join(","),
        ticketTotal: String(selectedSeatNumbers.length * 2500),
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
          <Text style={styles.headerTitle}>Ticket Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.statePanel}>
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : error || !bookingOptions ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateText}>{error ?? "Booking options not found"}</Text>
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
              <Text style={styles.prompt}>
                Where would you like to see the movie? Kindly select as appropriate
              </Text>

              <View style={styles.ticketGrid}>
                {bookingOptions.ticketTypes.map((ticketType) => (
                  <Pressable
                    key={ticketType.label}
                    style={[
                      styles.ticketCard,
                      selectedTicketType?.label === ticketType.label && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedTicketType(ticketType)}>
                    <Text style={styles.ticketLabel}>{ticketType.label}</Text>
                    <Text style={styles.ticketPrice}>
                      Tickets from {formatPrice(ticketType.minPrice)} -{" "}
                      {formatPrice(ticketType.maxPrice)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Dropdown
                title="Location"
                placeholder="Select Location"
                value={selectedLocation?.name}
                isOpen={isLocationOpen}
                options={bookingOptions.locations.map((location) => ({
                  key: location.name,
                  label: location.name,
                  value: location,
                }))}
                onToggle={() => {
                  setIsLocationOpen((isOpen) => !isOpen);
                  setIsHallOpen(false);
                }}
                onSelect={(location) => {
                  setSelectedLocation(location);
                  setIsLocationOpen(false);
                  setIsHallOpen(false);
                }}
              />

              <Dropdown
                title="Cinema Location"
                placeholder="Select Cinema Hall"
                value={selectedHall?.name}
                isOpen={isHallOpen}
                options={(selectedLocation?.halls ?? []).map((hall) => ({
                  key: hall.name,
                  label: hall.name,
                  value: hall,
                }))}
                onToggle={() => {
                  setIsHallOpen((isOpen) => !isOpen);
                  setIsLocationOpen(false);
                }}
                onSelect={(hall) => {
                  setSelectedHall(hall);
                  setIsHallOpen(false);
                }}
              />

              <View style={styles.dateSection}>
                <Text style={styles.sectionLabel}>Select a date</Text>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <View style={styles.dateRow}>
                  {availableDates.map((dateOption) => {
                    const label = formatDateLabel(dateOption.date);

                    return (
                      <Pressable
                        key={dateOption.date}
                        style={[
                          styles.dateButton,
                          selectedDate?.date === dateOption.date && styles.selectedDateButton,
                        ]}
                        onPress={() => setSelectedDate(dateOption)}>
                        <Text style={styles.dateWeekday}>{label.weekday}</Text>
                        <Text style={styles.dateDay}>{label.day}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.timeSection}>
                <Text style={styles.sectionLabel}>Available Time</Text>
                <View style={styles.timeGrid}>
                  {availableTimes.map((time) => (
                    <Pressable
                      key={time.id}
                      style={[
                        styles.timeButton,
                        selectedTime?.id === time.id && styles.selectedTimeButton,
                      ]}
                      onPress={() => setSelectedTime(time)}>
                      <Text
                        style={[
                          styles.timeText,
                          selectedTime?.id === time.id && styles.selectedTimeText,
                        ]}>
                        {time.startTime}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Text style={styles.selectSeatLabel}>Select Seat</Text>
              <View style={styles.legendRow}>
                <LegendItem label="Available" color="#4b4b4b" />
                <LegendItem label="Unavailable" color="#777777" crossed />
                <LegendItem label="Selected" color="#cfcfcf" />
              </View>

              <CinemaSeatLayout
                clientId={clientId}
                locks={seatLocks}
                selectedSeats={selectedSeatNumbers}
                onSeatPress={toggleSeat}
              />

              {seatError && <Text style={styles.seatErrorText}>{seatError}</Text>}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.proceedButton, !canProceed && styles.disabledProceed]}
                disabled={!canProceed}
                onPress={proceedToFoodAndBeverage}>
                <Text style={styles.proceedText}>Proceed</Text>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

function CinemaSeatLayout({
  clientId,
  locks,
  selectedSeats,
  onSeatPress,
}: {
  clientId: string;
  locks: Array<{ seatNumber: string; lockedBy: string }>;
  selectedSeats: string[];
  onSeatPress: (seatNumber: string) => void;
}) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8];
  const selectedSeatLabel = selectedSeats.length > 0 ? selectedSeats.join(", ") : "-";
  const subtotal = selectedSeats.length * 2500;

  function getSeatState(seatNumber: string) {
    const lock = locks.find((seatLock) => seatLock.seatNumber === seatNumber);

    if (!lock) {
      return "available";
    }

    return lock.lockedBy === clientId ? "selected" : "unavailable";
  }

  return (
    <View style={styles.seatLayout}>
      <View style={styles.screenWrapper}>
        <View style={styles.screenArc} />
        <Text style={styles.screenText}>Screen</Text>
      </View>

      <View style={styles.seatGrid}>
        {rows.map((row) => (
          <View key={row} style={styles.seatRow}>
            <Text style={styles.rowLabel}>{row}</Text>
            <View style={styles.seatColumns}>
              {columns.map((column) => {
                const seatNumber = `${row}${column}`;
                const seatState = getSeatState(seatNumber);

                return (
                  <Pressable
                    key={seatNumber}
                    disabled={seatState === "unavailable"}
                    style={[
                      styles.seat,
                      seatState === "selected" && styles.selectedSeat,
                      seatState === "unavailable" && styles.unavailableSeat,
                    ]}
                    onPress={() => onSeatPress(seatNumber)}>
                    {seatState === "unavailable" && <Text style={styles.seatCross}>x</Text>}
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.rowLabel}>{row}</Text>
          </View>
        ))}
      </View>

      <View style={styles.seatSummary}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>SEAT</Text>
          <Text style={styles.summaryValue}>{selectedSeatLabel}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>SUB-TOTAL</Text>
          <Text style={styles.summaryValue}>RM {(subtotal / 100).toFixed(0)}</Text>
        </View>
      </View>
    </View>
  );
}

function Dropdown<T>({
  title,
  placeholder,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  title: string;
  placeholder: string;
  value?: string;
  options: Array<{ key: string; label: string; value: T }>;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.selectBlock}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <Pressable style={styles.dropdownButton} onPress={onToggle}>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]} numberOfLines={1}>
          {value ?? placeholder}
        </Text>
        <SymbolView
          name={isOpen ? "chevron.up" : "chevron.down"}
          tintColor="#5b5b5b"
          size={18}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          {options.map((option) => {
            const isSelected = option.label === value;

            return (
              <Pressable
                key={option.key}
                style={[styles.dropdownOption, isSelected && styles.selectedDropdownOption]}
                onPress={() => onSelect(option.value)}>
                <Text
                  style={[
                    styles.dropdownOptionText,
                    isSelected && styles.selectedDropdownOptionText,
                  ]}
                  numberOfLines={2}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function LegendItem({
  label,
  color,
  crossed = false,
}: {
  label: string;
  color: string;
  crossed?: boolean;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendBox, { backgroundColor: color }]}>
        {crossed && <Text style={styles.legendCross}>x</Text>}
      </View>
      <Text style={styles.legendText}>{label}</Text>
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
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 122,
  },
  prompt: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    marginBottom: 26,
  },
  ticketGrid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  ticketCard: {
    flex: 1,
    minHeight: 90,
    borderRadius: 5,
    backgroundColor: "#3c3c3c",
    padding: 12,
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#3c3c3c",
  },
  selectedCard: {
    borderColor: "#ffffff",
  },
  ticketLabel: {
    color: "#cfcfcf",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 5,
  },
  ticketPrice: {
    color: "#ffffff",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
  },
  selectBlock: {
    marginBottom: 18,
    gap: 10,
  },
  sectionLabel: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  dropdownButton: {
    minHeight: 46,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  dropdownText: {
    flex: 1,
    color: "#080808",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    paddingRight: 10,
  },
  dropdownPlaceholder: {
    color: "#6e6e6e",
  },
  dropdownMenu: {
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#5f5f5f",
    backgroundColor: "#101010",
  },
  dropdownOption: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  selectedDropdownOption: {
    backgroundColor: "#2d2d2d",
  },
  dropdownOptionText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  selectedDropdownOptionText: {
    color: "#dcdcdc",
  },
  dateSection: {
    gap: 10,
    marginBottom: 20,
  },
  monthLabel: {
    color: "#bdbdbd",
    fontSize: 12,
    fontWeight: "800",
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dateButton: {
    width: 46,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedDateButton: {
    borderColor: "#ffffff",
    backgroundColor: "#1d1d1d",
  },
  dateWeekday: {
    color: "#ffffff",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
  },
  dateDay: {
    color: "#bdbdbd",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
  },
  timeSection: {
    gap: 12,
    marginBottom: 28,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  timeButton: {
    minWidth: 70,
    height: 38,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#a6a6a6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  selectedTimeButton: {
    backgroundColor: "#ffffff",
  },
  timeText: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
  },
  selectedTimeText: {
    color: "#080808",
  },
  selectSeatLabel: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  legendCross: {
    color: "#ffffff",
    fontSize: 13,
    lineHeight: 15,
  },
  legendText: {
    color: "#bdbdbd",
    fontSize: 12,
    fontWeight: "700",
  },
  seatLayout: {
    marginTop: 36,
    paddingBottom: 28,
  },
  screenWrapper: {
    alignItems: "center",
    marginBottom: 22,
  },
  screenArc: {
    width: "76%",
    height: 54,
    borderTopWidth: 12,
    borderTopColor: "#bdbdbd",
    borderRadius: 120,
    backgroundColor: "#222222",
    transform: [{ perspective: 180 }, { rotateX: "45deg" }],
  },
  screenText: {
    marginTop: 4,
    color: "#bdbdbd",
    fontSize: 12,
    fontWeight: "800",
  },
  seatGrid: {
    gap: 13,
    marginBottom: 34,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rowLabel: {
    width: 16,
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  seatColumns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  seat: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#3d3d3d",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSeat: {
    backgroundColor: "#cfcfcf",
  },
  unavailableSeat: {
    backgroundColor: "#707070",
  },
  seatCross: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "900",
  },
  seatSummary: {
    alignSelf: "center",
    minWidth: 236,
    minHeight: 62,
    borderWidth: 1,
    borderColor: "#8d8d8d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  summaryColumn: {
    minWidth: 84,
    alignItems: "center",
    gap: 6,
  },
  summaryDivider: {
    width: 1,
    height: 42,
    backgroundColor: "#8d8d8d",
    marginHorizontal: 16,
  },
  summaryLabel: {
    color: "#bdbdbd",
    fontSize: 12,
    fontWeight: "800",
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
  },
  seatErrorText: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#050505",
    paddingHorizontal: 32,
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
  proceedButton: {
    flex: 1,
    maxWidth: 178,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#a9a9a9",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledProceed: {
    opacity: 0.55,
  },
  proceedText: {
    color: "#ffffff",
    fontSize: 18,
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
