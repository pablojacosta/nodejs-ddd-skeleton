import { Container } from "inversify";

export const PARAMETERS = {
    // parameter: Symbol.for("parameter"),
    mongoDbUrl: Symbol.for("mongoDbUrl"),
    mongoDbDatabase: Symbol.for("mongoDbDatabase"),
};

export const loadParameters = (container: Container): void => {
    container.bind(PARAMETERS.mongoDbUrl).toConstantValue(process.env.MONGODB_URL);
    container.bind(PARAMETERS.mongoDbDatabase).toConstantValue(process.env.MONGODB_DATABASE);
};
