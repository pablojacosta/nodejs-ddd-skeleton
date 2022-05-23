import { query } from "express-validator";
import { validatorResponseMiddleware } from "../utils";

export const getReportsValidator = [
    query("offset").optional().isNumeric().isInt({ min: 0, max: 100 }),
    query("limit").optional().isNumeric().isInt({ min: 1, max: 40 }),
    query("userId").optional().isUUID(),
    query("dateFrom").optional().isNumeric(),
    query("dateTo").optional().isNumeric(),
    validatorResponseMiddleware,
];
