import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/UserRepository";
import {
    users,
    userForPost,
    userMissingAge,
    userMissingCountry,
    userMissingEmail,
    userMissingName,
    nowTimeStamp,
} from "tests/Helpers";

describe("Post User", () => {
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
        const response = await request.post("/users").set({ Authorization: "estoesuntoken" }).send(userForPost);

        expect(response.status).toBe(201);
        expect(response.body.id).toHaveLength(36);
        expect(response.body.email).toStrictEqual(userForPost.email);
        expect(response.body.name).toStrictEqual(userForPost.name);
        expect(response.body.age).toStrictEqual(userForPost.age);
        expect(response.body.country).toStrictEqual(userForPost.country);
        expect(response.body.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(response.body.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);
    });

    it("Error: missing email", async () => {
        const response = await request.post("/users").set({ Authorization: "estoesuntoken" }).send(userMissingEmail);

        expect(response.status).toBe(400);
    });

    it("Error: missing name", async () => {
        const response = await request.post("/users").set({ Authorization: "estoesuntoken" }).send(userMissingName);

        expect(response.status).toBe(400);
    });

    it("Error: missing age", async () => {
        const response = await request.post("/users").set({ Authorization: "estoesuntoken" }).send(userMissingAge);

        expect(response.status).toBe(400);
    });

    it("Error: missing country", async () => {
        const response = await request.post("/users").set({ Authorization: "estoesuntoken" }).send(userMissingCountry);

        expect(response.status).toBe(400);
    });
});
