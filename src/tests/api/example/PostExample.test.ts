// This test is only an example of how to do API testing
import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/ExampleRepository";
import { examples } from "tests/Helpers";

describe("Post Example", () => {
    let app: e.Application, container: Container;
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;

    beforeAll(async () => {
        const application = await bootstrapApplication();

        app = application.app;
        container = application.container;
        server = application.server;
        request = supertest(app);

        await container
            .get<ConnectionManager>(TYPES.ConnectionManager)
            .getCollection(collectionName)
            .insertMany(examples);
    });

    afterAll(async () => {
        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection(collectionName).drop();
        await container.get<ConnectionManager>(TYPES.ConnectionManager).close();
        server.close();
    });

    it("Success", async () => {
        const response = await request.post("/examples").send({ id: 4, value: "test" });

        expect(response.status).toBe(201);
        expect(response.body.value).toStrictEqual("test");
    });

    it("Fails because id is repeated", async () => {
        const response = await request.post("/examples").send({ id: 1, value: "test" });

        expect(response.status).toBe(400);
    });
});
