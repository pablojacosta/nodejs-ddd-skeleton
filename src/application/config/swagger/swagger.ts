export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "nodejs-ddd-skeleton",
            version: "1.0.0",
            description: "A simple API",
            contact: {
                name: "API Support",
                url: "http://www.nftstudios.io",
            },
        },
    },
    apis: ["./src/application/api/controller/**/*.ts", "./src/domain/entity/**/*.ts", "./src/domain/service/**/*.ts"],
};
