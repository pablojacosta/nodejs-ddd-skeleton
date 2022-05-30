// This test is only an example of how to do API testing
import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";

describe("Get Home", () => {
    let app: e.Application, container: Container;
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;

    beforeAll(async () => {
        const application = await bootstrapApplication();
        app = application.app;
        container = application.container;
        server = application.server;
        request = supertest(app);
    });

    afterAll(async () => {
        await container.get<ConnectionManager>(TYPES.ConnectionManager).close();
        server.close();
    });

    it("Success", async () => {
        const response = await request.get("/");

        expect(response.status).toBe(200);
        expect(response.body.message).toStrictEqual("NodeJS DDD Skeleton");
    });
});
