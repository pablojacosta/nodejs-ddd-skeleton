import { param } from "express-validator";
import { validatorResponseMiddleware } from "./utils";

export const paramIdValidator = [param("id").notEmpty().isUUID(), validatorResponseMiddleware];
