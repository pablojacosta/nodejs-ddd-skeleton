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

describe("Get Examples", () => {
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
        const response = await request.get("/examples").query({ sort: "id", direction: "asc" }).send();

        expect(response.status).toBe(200);
        expect(response.body.length).toStrictEqual(examples.length);
        expect(response.body[0].id).toStrictEqual(examples[0].id);
        expect(response.body[0].value).toStrictEqual(examples[0].value);
    });
});
