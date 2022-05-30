import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/ReportRepository";
import { reports } from "tests/Helpers";

describe("Get Reports", () => {
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
        const response = await request.get("/reports").send();

        expect(response.status).toBe(200);
        expect(response.body.length).toStrictEqual(reports.length);
        expect(response.body[0].id).toStrictEqual(reports[0].id);
        expect(response.body[0].userId).toStrictEqual(reports[0].userId);
        expect(response.body[0].title).toStrictEqual(reports[0].title);
        expect(response.body[0].content).toStrictEqual(reports[0].content);
        expect(response.body[0].status).toStrictEqual(reports[0].status);
        expect(response.body[0].publishAt).toStrictEqual(reports[0].publishAt);
        expect(response.body[0].createdAt).toStrictEqual(reports[0].createdAt);
        expect(response.body[0].updatedAt).toStrictEqual(reports[0].updatedAt);
        expect(response.body[1].id).toStrictEqual(reports[1].id);
        expect(response.body[1].userId).toStrictEqual(reports[1].userId);
        expect(response.body[1].title).toStrictEqual(reports[1].title);
        expect(response.body[1].content).toStrictEqual(reports[1].content);
        expect(response.body[1].status).toStrictEqual(reports[1].status);
        expect(response.body[1].publishAt).toStrictEqual(reports[1].publishAt);
        expect(response.body[1].createdAt).toStrictEqual(reports[1].createdAt);
        expect(response.body[1].updatedAt).toStrictEqual(reports[1].updatedAt);
    });
});
