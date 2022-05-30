import supertest from "supertest";
import { TYPES } from "application/config/ioc/types";
import { ConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { bootstrapApplication } from "application/config/bootstrap";
import e from "express";
import { Container } from "inversify";
import { Server } from "http";
import { collectionName } from "infrastructure/repository/ReportRepository";
import {
    nowTimeStamp,
    reportForPostDraft,
    reportForPostPublished,
    reportMissingContent,
    reportMissingPublishAt,
    reportMissingTitle,
    reportMissingUserId,
    reports,
    users,
} from "tests/Helpers";
import { ReportStatus } from "domain/entity/Report";

describe("Post Report", () => {
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
            .post("/reports")
            .set({ Authorization: "estoesuntoken" })
            .send(reportForPostPublished);

        expect(response.status).toBe(201);
        expect(response.body.id).toHaveLength(36);
        expect(response.body.userId).toStrictEqual(reportForPostPublished.userId);
        expect(response.body.title).toStrictEqual(reportForPostPublished.title);
        expect(response.body.content).toStrictEqual(reportForPostPublished.content);
        expect(response.body.publishAt).toStrictEqual(reportForPostPublished.publishAt);
        expect(response.body.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(response.body.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (response.body.publishAt <= nowTimeStamp) {
            expect(response.body.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(response.body.status).toStrictEqual(ReportStatus.Draft);
        }
    });

    it("Success", async () => {
        const response = await request
            .post("/reports")
            .set({ Authorization: "estoesuntoken" })
            .send(reportForPostDraft);

        expect(response.status).toBe(201);
        expect(response.body.id).toHaveLength(36);
        expect(response.body.userId).toStrictEqual(reportForPostDraft.userId);
        expect(response.body.title).toStrictEqual(reportForPostDraft.title);
        expect(response.body.content).toStrictEqual(reportForPostDraft.content);
        expect(response.body.publishAt).toStrictEqual(reportForPostDraft.publishAt);
        expect(response.body.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(response.body.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (response.body.publishAt <= nowTimeStamp) {
            expect(response.body.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(response.body.status).toStrictEqual(ReportStatus.Draft);
        }
    });

    it("Error: missing userId", async () => {
        const response = await request
            .post("/reports")
            .set({ Authorization: "estoesuntoken" })
            .send(reportMissingUserId);

        expect(response.status).toBe(400);
    });

    it("Error: missing title", async () => {
        const response = await request
            .post("/reports")
            .set({ Authorization: "estoesuntoken" })
            .send(reportMissingTitle);

        expect(response.status).toBe(400);
    });

    it("Error: missing content", async () => {
        const response = await request
            .post("/reports")
            .set({ Authorization: "estoesuntoken" })
            .send(reportMissingContent);

        expect(response.status).toBe(400);
    });

    it("Error: missing publishAt", async () => {
        const response = await request
            .post("/reports")
            .set({ Authorization: "estoesuntoken" })
            .send(reportMissingPublishAt);

        expect(response.status).toBe(400);
    });
});
