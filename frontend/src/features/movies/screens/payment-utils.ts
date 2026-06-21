import { SelectedConcessionItem } from "../types";

export function formatPrice(value: number) {
  return `RM ${(value / 100).toFixed(0)}`;
}

export function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export function parseConcessions(value: string) {
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

export function buildPaymentParams(params: Record<string, string | string[] | undefined>) {
  return {
    id: readParam(params.id),
    ticketType: readParam(params.ticketType),
    location: readParam(params.location),
    hall: readParam(params.hall),
    date: readParam(params.date),
    time: readParam(params.time),
    showtimeId: readParam(params.showtimeId),
    seats: readParam(params.seats),
    ticketTotal: readParam(params.ticketTotal),
    concessionTotal: readParam(params.concessionTotal),
    grandTotal: readParam(params.grandTotal),
    concessions: readParam(params.concessions),
  };
}
