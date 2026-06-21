import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export type BookingTransactionPayload = {
  showtimeId: number;
  ticketType: string;
  location: string;
  cinemaHall: string;
  showDate: Date;
  startTime: string;
  seats: string[];
  concessions: unknown[];
  ticketTotal: number;
  concessionTotal: number;
  grandTotal: number;
  paymentMethod: string;
  cardNumber?: string;
};

function createReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `CB-${timestamp}-${suffix}`;
}

function getCardLastFour(cardNumber?: string) {
  const digits = cardNumber?.replace(/\D/g, "") ?? "";

  return digits.length >= 4 ? digits.slice(-4) : "";
}

export async function createBookingTransaction(payload: BookingTransactionPayload) {
  const showtime = await prisma.showtime.findUnique({
    where: {
      id: payload.showtimeId,
    },
  });

  if (!showtime) {
    throw new AppError("Showtime not found", 404);
  }

  return prisma.bookingTransaction.create({
    data: {
      reference: createReference(),
      showtimeId: payload.showtimeId,
      ticketType: payload.ticketType,
      location: payload.location,
      cinemaHall: payload.cinemaHall,
      showDate: payload.showDate,
      startTime: payload.startTime,
      seats: JSON.stringify(payload.seats),
      concessions: JSON.stringify(payload.concessions),
      ticketTotal: payload.ticketTotal,
      concessionTotal: payload.concessionTotal,
      grandTotal: payload.grandTotal,
      paymentMethod: payload.paymentMethod,
      cardLastFour: getCardLastFour(payload.cardNumber),
      status: "PAID",
    },
  });
}
