import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/UserRepository";
import { users } from "tests/Helpers";

describe("Get Users", () => {
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
        const response = await request.get("/users").send();

        expect(response.status).toBe(200);
        expect(response.body.length).toStrictEqual(users.length);
        expect(response.body[0].id).toStrictEqual(users[0].id);
        expect(response.body[0].email).toStrictEqual(users[0].email);
        expect(response.body[0].name).toStrictEqual(users[0].name);
        expect(response.body[0].age).toStrictEqual(users[0].age);
        expect(response.body[0].country).toStrictEqual(users[0].country);
        expect(response.body[1].id).toStrictEqual(users[1].id);
        expect(response.body[1].email).toStrictEqual(users[1].email);
        expect(response.body[1].name).toStrictEqual(users[1].name);
        expect(response.body[1].age).toStrictEqual(users[1].age);
        expect(response.body[1].country).toStrictEqual(users[1].country);
        expect(response.body[2].id).toStrictEqual(users[2].id);
        expect(response.body[2].email).toStrictEqual(users[2].email);
        expect(response.body[2].name).toStrictEqual(users[2].name);
        expect(response.body[2].age).toStrictEqual(users[2].age);
        expect(response.body[2].country).toStrictEqual(users[2].country);
    });
});
