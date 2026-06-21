"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConcessionItems = listConcessionItems;
const concession_service_1 = require("./concession.service");
async function listConcessionItems(req, res, next) {
    try {
        const items = await (0, concession_service_1.getConcessionItems)();
        return res.status(200).json({
            success: true,
            data: items,
        });
    }
    catch (error) {
        return next(error);
    }
}
