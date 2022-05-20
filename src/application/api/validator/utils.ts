import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validatorResponseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    const errors = validationResult(request);
    errors.isEmpty() ? next() : response.status(400).send({ errors: errors.array({ onlyFirstError: true }) });
};
