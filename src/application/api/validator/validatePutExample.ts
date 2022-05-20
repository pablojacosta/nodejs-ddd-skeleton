import { body } from "express-validator";
import { validatorResponseMiddleware } from "./utils";

export const validatePutExample = [body("value").notEmpty().isString(), validatorResponseMiddleware];
