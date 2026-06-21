import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { BookingTransactionPayload, createBookingTransaction } from "./booking.service";

function parsePositiveInteger(value: unknown, field: string) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    throw new AppError(`${field} must be a positive integer`, 400);
  }

  return numberValue;
}

function parseMoney(value: unknown, field: string) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new AppError(`${field} must be a valid amount`, 400);
  }

  return numberValue;
}

function parseRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`${field} is required`, 400);
  }

  return value.trim();
}

function parseDate(value: unknown) {
  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    throw new AppError("showDate must be a valid date", 400);
  }

  return date;
}

function parseSeats(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new AppError("seats is required", 400);
  }

  return value.map((seat) => parseRequiredString(seat, "seat"));
}

function normalizePayload(body: Record<string, unknown>): BookingTransactionPayload {
  return {
    showtimeId: parsePositiveInteger(body.showtimeId, "showtimeId"),
    ticketType: parseRequiredString(body.ticketType, "ticketType"),
    location: parseRequiredString(body.location, "location"),
    cinemaHall: parseRequiredString(body.cinemaHall, "cinemaHall"),
    showDate: parseDate(body.showDate),
    startTime: parseRequiredString(body.startTime, "startTime"),
    seats: parseSeats(body.seats),
    concessions: Array.isArray(body.concessions) ? body.concessions : [],
    ticketTotal: parseMoney(body.ticketTotal, "ticketTotal"),
    concessionTotal: parseMoney(body.concessionTotal, "concessionTotal"),
    grandTotal: parseMoney(body.grandTotal, "grandTotal"),
    paymentMethod: parseRequiredString(body.paymentMethod, "paymentMethod"),
    cardNumber: typeof body.cardNumber === "string" ? body.cardNumber : undefined,
  };
}

export async function storeBookingTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const transaction = await createBookingTransaction(normalizePayload(req.body));

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return next(error);
  }
}
