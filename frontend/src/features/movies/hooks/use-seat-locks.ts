import { useCallback, useEffect, useMemo, useState } from "react";

import { createSeatSocket, fetchSeatLocks, lockSeat, releaseSeat } from "../api/movie-api";
import { SeatLock } from "../types";

export function useSeatLocks(showtimeId: number | null) {
  const clientId = useMemo(
    () => `client-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    [],
  );
  const [locks, setLocks] = useState<SeatLock[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!showtimeId) {
      setLocks([]);
      return;
    }

    try {
      setLocks(await fetchSeatLocks(showtimeId));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load seats");
    }
  }, [showtimeId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!showtimeId) {
      return;
    }

    const socket = createSeatSocket(showtimeId, clientId);

    if (!socket) {
      const intervalId = setInterval(reload, 2500);
      return () => clearInterval(intervalId);
    }

    let isActive = true;

    socket.onmessage = (event) => {
      if (!isActive) {
        return;
      }

      try {
        const payload = JSON.parse(String(event.data)) as {
          type: string;
          locks: SeatLock[];
        };

        if (payload.type === "seat-locks") {
          setLocks(payload.locks);
        }

        setError(null);
      } catch {
        setError("Unable to read live seat updates");
      }
    };

    socket.onerror = () => {
      if (isActive) {
        setError("Live seat updates disconnected");
      }
    };

    socket.onclose = () => {
      if (isActive) {
        setError("Live seat updates disconnected");
      }
    };

    return () => {
      isActive = false;
      socket.close();
    };
  }, [clientId, reload, showtimeId]);

  const toggleSeat = useCallback(
    async (seatNumber: string) => {
      if (!showtimeId) {
        return;
      }

      const existingLock = locks.find((lock) => lock.seatNumber === seatNumber);

      try {
        if (existingLock?.lockedBy === clientId) {
          await releaseSeat(showtimeId, seatNumber, clientId);
        } else if (!existingLock) {
          await lockSeat(showtimeId, seatNumber, clientId);
        }

        await reload();
      } catch (seatError) {
        setError(seatError instanceof Error ? seatError.message : "Unable to update seat");
        await reload();
      }
    },
    [clientId, locks, reload, showtimeId],
  );

  return {
    clientId,
    locks,
    error,
    toggleSeat,
  };
}
