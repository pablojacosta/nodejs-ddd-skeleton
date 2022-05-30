import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/ReportRepository";
import { reports } from "tests/Helpers";

describe("Get Report", () => {
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
            .insertMany(reports);
    });

    afterAll(async () => {
        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection(collectionName).drop();
        await container.get<ConnectionManager>(TYPES.ConnectionManager).close();
        server.close();
    });

    it("Success", async () => {
        const response = await request.get("/reports/2127124b-08f8-4655-bb69-988f5d0771fa").send();

        expect(response.status).toBe(200);
        expect(response.body.id).toStrictEqual(reports[0].id);
        expect(response.body.userId).toStrictEqual(reports[0].userId);
        expect(response.body.title).toStrictEqual(reports[0].title);
        expect(response.body.content).toStrictEqual(reports[0].content);
        expect(response.body.status).toStrictEqual(reports[0].status);
        expect(response.body.publishAt).toStrictEqual(reports[0].publishAt);
        expect(response.body.createdAt).toStrictEqual(reports[0].createdAt);
        expect(response.body.updatedAt).toStrictEqual(reports[0].updatedAt);
    });

    it("Fails because user does not exist", async () => {
        const response = await request.get("/reports/2127124b-08f8-4655-bb69-988f5d077123").send();

        expect(response.status).toBe(404);
    });
});
