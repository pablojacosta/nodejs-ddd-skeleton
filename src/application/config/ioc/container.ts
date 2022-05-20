import { buildProviderModule } from "inversify-binding-decorators";
import { Container } from "inversify";
import winston, { format } from "winston";
import { loadParameters } from "./parameters";
import { TYPES } from "./types";

import "./loader";

export const createContainer = (): Container => {
    const container = new Container();

    const logger = winston.createLogger({
        format: format.combine(format.timestamp(), format.json()),
        transports: [new winston.transports.Console({ level: "debug" })],
    });

    container.bind(TYPES.Logger).toConstantValue(logger);

    loadParameters(container);

    // add classes with @provideSingleton decorator into the container
    container.load(buildProviderModule());

    return container;
};
