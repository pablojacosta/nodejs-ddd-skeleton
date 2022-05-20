import { body } from "express-validator";
import { validatorResponseMiddleware } from "./utils";

export const validatePostExample = [
    body("id").notEmpty().isNumeric(),
    body("value").notEmpty().isString(),
    validatorResponseMiddleware,
];
