import { body } from "express-validator";
import { validatorResponseMiddleware } from "../utils";

export const postAndPutReportValidator = [
    body("userId").notEmpty().isUUID(),
    body("title").notEmpty().isString().isLength({ min: 2, max: 200 }),
    body("content").notEmpty().isString().isLength({ min: 2, max: 500 }),
    body("publishAt").notEmpty().isNumeric(),
    validatorResponseMiddleware,
];
