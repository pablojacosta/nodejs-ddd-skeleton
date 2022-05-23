import { PARAMETERS } from "application/config/ioc/parameters";
import { TYPES } from "application/config/ioc/types";
import { NextFunction, Request, Response } from "express";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { inject } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { AuthenticationException } from "./AuthenticationException";

@provideSingleton(TYPES.AuthorizationMiddleware)
export class AuthorizationMiddleware extends BaseMiddleware {
    @inject(PARAMETERS.authorizationToken) private readonly token: string;

    public handler(request: Request, response: Response, next: NextFunction): void {
        if (!request.header("Authorization")) {
            next(new AuthenticationException("Authorization Header Expected"));
        }

        if (request.header("Authorization") !== this.token) {
            next(new AuthenticationException("Wrong Token"));
        }

        next();
    }
}
