import { InversifyExpressServer } from "inversify-express-utils";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { Container } from "inversify";
import { Logger } from "winston";
import { DEV } from "application/config/environments";
import { AppException } from "application/exception/AppException";
import { DomainException } from "domain/exception/DomainException";
import { TYPES } from "application/config/ioc/types";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "application/config/swagger/swagger";

export const createApi = async (container: Container): Promise<Application> => {
    // start inversify express server
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(
            express.urlencoded({
                extended: true,
            })
        );

        app.use(express.json());

        app.use(
            cors({
                origin: process.env.CORS_ALLOWED_ORIGIN,
                methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "PATCH"],
            })
        );

        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));
    });

    server.setErrorConfig((app) => {
        app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
            if (error instanceof AppException || error instanceof DomainException) {
                return res.status(error.code).json({ error: error.message });
            }

            const logger = container.get<Logger>(TYPES.Logger);

            logger.error({
                level: "error",
                message: (error as Error).stack,
                meta: {
                    url: req.originalUrl,
                    method: req.method,
                    body: JSON.stringify(req.body),
                },
            });

            return res
                .status(500)
                .json({ error: process.env.NODE_ENV === DEV ? (error as Error).toString() : "Something went wrong!" });
        });
    });

    return server.build();
};
