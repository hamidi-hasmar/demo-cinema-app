import { Request, Response, NextFunction } from "express";
import { getConcessionItems } from "./concession.service";

export async function listConcessionItems(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await getConcessionItems();

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    return next(error);
  }
}
