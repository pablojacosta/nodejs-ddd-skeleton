import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/UserRepository";
import { users } from "tests/Helpers";

describe("Get User", () => {
    let app: e.Application, container: Container;
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;

    beforeAll(async () => {
        const application = await bootstrapApplication();

        app = application.app;
        container = application.container;
        server = application.server;
        request = supertest(app);

        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection(collectionName).insertMany(users);
    });

    afterAll(async () => {
        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection(collectionName).drop();
        await container.get<ConnectionManager>(TYPES.ConnectionManager).close();
        server.close();
    });

    it("Success", async () => {
        const response = await request.get("/users/969f4040-a622-4ac6-bb38-4dea10747b87").send();

        expect(response.status).toBe(200);
        expect(response.body.id).toStrictEqual(users[0].id);
        expect(response.body.email).toStrictEqual(users[0].email);
        expect(response.body.name).toStrictEqual(users[0].name);
        expect(response.body.age).toStrictEqual(users[0].age);
        expect(response.body.country).toStrictEqual(users[0].country);
    });

    it("Fails because User does not exist", async () => {
        const response = await request.get("/users/38f37442-efcf-44bd-b316-342fff066123").send();

        expect(response.status).toBe(404);
    });
});
