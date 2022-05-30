import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/ReportRepository";
import { nowTimeStamp, reportForPutDraft, reportForPutPublished, reports, users } from "tests/Helpers";
import { ReportStatus } from "domain/entity/Report";

describe("Put User", () => {
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

        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection("user").insertMany(users);
    });

    afterAll(async () => {
        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection(collectionName).drop();
        await container.get<ConnectionManager>(TYPES.ConnectionManager).getCollection("user").drop();
        await container.get<ConnectionManager>(TYPES.ConnectionManager).close();
        server.close();
    });

    it("Success", async () => {
        const response = await request
            .put("/reports/2127124b-08f8-4655-bb69-988f5d0771fa")
            .set({ Authorization: "estoesuntoken" })
            .send(reportForPutPublished);

        expect(response.status).toBe(200);
        expect(response.body.title).toStrictEqual(reportForPutPublished.title);
        expect(response.body.content).toStrictEqual(reportForPutPublished.content);
        expect(response.body.publishAt).toStrictEqual(reportForPutPublished.publishAt);
        expect(response.body.createdAt).toBeLessThan(nowTimeStamp);
        expect(response.body.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (response.body.publishAt <= nowTimeStamp) {
            expect(response.body.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(response.body.status).toStrictEqual(ReportStatus.Draft);
        }
    });

    it("Success", async () => {
        const response = await request
            .put("/reports/2127124b-08f8-4655-bb69-988f5d0771fa")
            .set({ Authorization: "estoesuntoken" })
            .send(reportForPutDraft);

        expect(response.status).toBe(200);
        expect(response.body.title).toStrictEqual(reportForPutDraft.title);
        expect(response.body.content).toStrictEqual(reportForPutDraft.content);
        expect(response.body.publishAt).toStrictEqual(reportForPutDraft.publishAt);
        expect(response.body.createdAt).toBeLessThan(nowTimeStamp);
        expect(response.body.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (response.body.publishAt <= nowTimeStamp) {
            expect(response.body.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(response.body.status).toStrictEqual(ReportStatus.Draft);
        }
    });

    it("Fails because example does not exist", async () => {
        const response = await request
            .put("/reports/2127124b-08f8-4655-bb69-988f5d077123")
            .set({ Authorization: "estoesuntoken" })
            .send(reportForPutPublished);

        expect(response.status).toBe(404);
    });
});
