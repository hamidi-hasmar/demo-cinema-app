import { Response } from "express";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";

type SeatEventClient = {
  id: string;
  response: Response;
};

const clientsByShowtime = new Map<number, SeatEventClient[]>();

function parseSeatNumber(seatNumber: string) {
  const normalized = seatNumber.trim().toUpperCase();

  if (!/^[A-H][1-8]$/.test(normalized)) {
    throw new AppError("Invalid seat number", 400);
  }

  return normalized;
}

async function ensureShowtime(showtimeId: number) {
  const showtime = await prisma.showtime.findUnique({
    where: {
      id: showtimeId,
    },
  });

  if (!showtime) {
    throw new AppError("Showtime not found", 404);
  }

  return showtime;
}

export async function getSeatLocks(showtimeId: number) {
  await ensureShowtime(showtimeId);

  return prisma.seatLock.findMany({
    where: {
      showtimeId,
    },
    orderBy: {
      seatNumber: "asc",
    },
    select: {
      seatNumber: true,
      lockedBy: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function lockSeat(showtimeId: number, seatNumber: string, clientId: string) {
  await ensureShowtime(showtimeId);
  const normalizedSeatNumber = parseSeatNumber(seatNumber);

  const existingLock = await prisma.seatLock.findUnique({
    where: {
      showtimeId_seatNumber: {
        showtimeId,
        seatNumber: normalizedSeatNumber,
      },
    },
  });

  if (existingLock && existingLock.lockedBy !== clientId) {
    throw new AppError("Seat is no longer available", 409);
  }

  const seatLock = existingLock
    ? existingLock
    : await prisma.seatLock.create({
        data: {
          showtimeId,
          seatNumber: normalizedSeatNumber,
          lockedBy: clientId,
        },
      });

  await broadcastSeatLocks(showtimeId);

  return seatLock;
}

export async function releaseSeat(showtimeId: number, seatNumber: string, clientId: string) {
  await ensureShowtime(showtimeId);
  const normalizedSeatNumber = parseSeatNumber(seatNumber);

  const existingLock = await prisma.seatLock.findUnique({
    where: {
      showtimeId_seatNumber: {
        showtimeId,
        seatNumber: normalizedSeatNumber,
      },
    },
  });

  if (!existingLock) {
    return;
  }

  if (existingLock.lockedBy !== clientId) {
    throw new AppError("Seat is locked by another user", 409);
  }

  await prisma.seatLock.delete({
    where: {
      id: existingLock.id,
    },
  });

  await broadcastSeatLocks(showtimeId);
}

export function addSeatEventClient(showtimeId: number, clientId: string, response: Response) {
  const clients = clientsByShowtime.get(showtimeId) ?? [];
  clients.push({
    id: clientId,
    response,
  });
  clientsByShowtime.set(showtimeId, clients);

  response.on("close", () => {
    const remainingClients = (clientsByShowtime.get(showtimeId) ?? []).filter(
      (client) => client.id !== clientId,
    );

    if (remainingClients.length === 0) {
      clientsByShowtime.delete(showtimeId);
      return;
    }

    clientsByShowtime.set(showtimeId, remainingClients);
  });
}

export async function broadcastSeatLocks(showtimeId: number) {
  const clients = clientsByShowtime.get(showtimeId) ?? [];

  if (clients.length === 0) {
    return;
  }

  const locks = await getSeatLocks(showtimeId);
  const eventPayload = `data: ${JSON.stringify({ locks })}\n\n`;

  for (const client of clients) {
    client.response.write(eventPayload);
  }
}
