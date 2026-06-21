import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import {
  addSeatEventClient,
  getSeatLocks,
  lockSeat,
  releaseSeat,
} from "./seat.service";

function parseShowtimeId(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    throw new AppError("Invalid showtime id", 400);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid showtime id", 400);
  }

  return id;
}

function parseClientId(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError("clientId is required", 400);
  }

  return value.trim();
}

function parseSeatNumberParam(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    throw new AppError("Invalid seat number", 400);
  }

  return value;
}

export async function listSeatLocks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const locks = await getSeatLocks(parseShowtimeId(req.params.showtimeId));

    return res.status(200).json({
      success: true,
      data: {
        locks,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function storeSeatLock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const lock = await lockSeat(
      parseShowtimeId(req.params.showtimeId),
      parseSeatNumberParam(req.params.seatNumber),
      parseClientId(req.body.clientId),
    );

    return res.status(200).json({
      success: true,
      data: lock,
    });
  } catch (error) {
    return next(error);
  }
}

export async function destroySeatLock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await releaseSeat(
      parseShowtimeId(req.params.showtimeId),
      parseSeatNumberParam(req.params.seatNumber),
      parseClientId(req.body.clientId),
    );

    return res.status(200).json({
      success: true,
      message: "Seat released successfully",
    });
  } catch (error) {
    return next(error);
  }
}

export async function streamSeatLocks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const showtimeId = parseShowtimeId(req.params.showtimeId);
    const clientId = parseClientId(req.query.clientId);
    const locks = await getSeatLocks(showtimeId);

    res.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    });

    res.write(`data: ${JSON.stringify({ locks })}\n\n`);
    addSeatEventClient(showtimeId, clientId, res);
  } catch (error) {
    next(error);
  }
}
