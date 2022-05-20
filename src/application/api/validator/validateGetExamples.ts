import { query } from "express-validator";
import { validatorResponseMiddleware } from "./utils";

export const validateGetExamples = [
    query("value").optional().notEmpty(),
    query("sort").optional().notEmpty(),
    query("direction").optional().isIn(["asc", "desc"]),
    query("offset").optional().isNumeric(),
    query("limit").optional().isNumeric(),
    validatorResponseMiddleware,
];
