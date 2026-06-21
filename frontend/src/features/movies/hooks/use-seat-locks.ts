import { useCallback, useEffect, useMemo, useState } from "react";

import { createSeatEvents, fetchSeatLocks, lockSeat, releaseSeat } from "../api/movie-api";
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

    const events = createSeatEvents(showtimeId, clientId);

    if (!events) {
      const intervalId = setInterval(reload, 2500);
      return () => clearInterval(intervalId);
    }

    events.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { locks: SeatLock[] };
        setLocks(payload.locks);
        setError(null);
      } catch {
        setError("Unable to read live seat updates");
      }
    };

    events.onerror = () => {
      setError("Live seat updates disconnected");
    };

    return () => events.close();
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
