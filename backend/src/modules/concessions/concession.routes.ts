import { Router } from "express";
import { listConcessionItems } from "./concession.controller";

const router = Router();

router.get("/", listConcessionItems);

export default router;
