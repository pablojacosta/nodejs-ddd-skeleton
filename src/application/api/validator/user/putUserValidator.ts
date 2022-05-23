import { body } from "express-validator";
import { validatorResponseMiddleware } from "../utils";

export const putUserValidator = [
    body("name").notEmpty().isString().isLength({ min: 2, max: 200 }),
    body("age").notEmpty().isNumeric().isInt({ gt: 0, lt: 121 }),
    body("country").notEmpty().isString().isLength({ min: 2, max: 2 }),
    validatorResponseMiddleware,
];
