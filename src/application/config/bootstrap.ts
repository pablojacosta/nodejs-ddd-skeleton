import { createApi } from "application/api";
import { createContainer } from "application/config/ioc/container";
import e from "express";
import { Server } from "http";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { Container } from "inversify";
import { Logger, transports } from "winston";
import { DEV, TEST } from "./environments";
import { TYPES } from "./ioc/types";
import { ICli } from "application/cli/Cli";
import { createCli } from "application/cli";

export type AppBootstrap = { container: Container; app: e.Application; server: Server };
export type CliBootstrap = { container: Container; cli: ICli };

const setupContainer = async (): Promise<Container> => {
    const container = createContainer();
    await container.get<ConnectionManager>(TYPES.ConnectionManager).connect();

    return container;
};

export const bootstrapApplication = async (): Promise<AppBootstrap> => {
    const container = await setupContainer();
    const app = await createApi(container);
    const logger = container.get<Logger>(TYPES.Logger);

    // TODO: Use Agent instead of TCP
    if (![DEV, TEST].includes(process.env.NODE_ENV || DEV)) {
        logger.add(
            new transports.Http({
                host: "http-intake.logs.datadoghq.eu",
                path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${process.env.SERVICE_NAME}&host=${process.env.NODE_ENV}`,
                ssl: true,
            })
        );
    }

    const server = app.listen(process.env.PORT, () => {
        if (process.env.NODE_ENV !== TEST) {
            logger.info(
                `⚡️[HttpServer]: Server is running at http://localhost:${process.env.PORT} as ${process.env.NODE_ENV}.`
            );
        }
    });

    return { container, app, server };
};

export const bootstrapCli = async (): Promise<CliBootstrap> => {
    const container = await setupContainer();
    const cli = createCli(container);

    return { container, cli };
};
