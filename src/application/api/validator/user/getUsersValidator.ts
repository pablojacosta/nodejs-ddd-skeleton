import { query } from "express-validator";
import { validatorResponseMiddleware } from "../utils";

export const getUsersValidator = [
    query("offset").optional().isNumeric().isInt({ min: 0, max: 100 }),
    query("limit").optional().isNumeric().isInt({ min: 1, max: 40 }),
    query("age").optional().isNumeric().isInt({ gt: 0, lt: 121 }),
    query("country").optional().isString().isLength({ min: 2, max: 2 }),
    validatorResponseMiddleware,
];
