import { Router } from "express";
import {
  destroySeatLock,
  listSeatLocks,
  storeSeatLock,
} from "./seat.controller";

const router = Router();

router.get("/:showtimeId/seats", listSeatLocks);
router.post("/:showtimeId/seats/:seatNumber/lock", storeSeatLock);
router.delete("/:showtimeId/seats/:seatNumber/lock", destroySeatLock);

export default router;
