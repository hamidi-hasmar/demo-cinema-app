import { Router } from "express";
import { storeBookingTransaction } from "./booking.controller";

const router = Router();

router.post("/transactions", storeBookingTransaction);

export default router;
