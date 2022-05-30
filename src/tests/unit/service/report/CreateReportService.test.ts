import { CreateReportService } from "domain/service/report/CreateReportService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { ReportRepository } from "infrastructure/repository/ReportRepository";
import { nowTimeStamp, reportForCreateServiceDraft, reportForCreateServicePublished } from "tests/Helpers";
import { IdGenerator } from "infrastructure/idGenerator/IdGenerator";
import { UserRepository } from "infrastructure/repository/UserRepository";
import { ReportStatus } from "domain/entity/Report";

jest.mock("infrastructure/idGenerator/IdGenerator", () => ({
    IdGenerator: jest.fn().mockImplementation(() => ({
        generateId: () => "00000000-0000-0000-0000-000000000000",
    })),
}));

jest.mock("infrastructure/repository/UserRepository", () => ({
    UserRepository: jest.fn().mockImplementation(() => ({
        findOneById: () => "969f4040-a622-4ac6-bb38-4dea10747b87",
    })),
}));

jest.mock("infrastructure/repository/ReportRepository");

describe("Create Report Service", () => {
    const repository = new ReportRepository({} as IConnectionManager);
    const idGenerator = new IdGenerator();
    const userRepository = new UserRepository({} as IConnectionManager);
    const service = new CreateReportService(repository, idGenerator, userRepository);

    it("Success - Published Report", async () => {
        const report = await service.create(reportForCreateServicePublished);

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(report.id).toHaveLength(36);
        expect(report.userId).toStrictEqual(reportForCreateServicePublished.userId);
        expect(report.title).toStrictEqual(reportForCreateServicePublished.title);
        expect(report.content).toStrictEqual(reportForCreateServicePublished.content);
        expect(report.publishAt).toStrictEqual(reportForCreateServicePublished.publishAt);
        expect(report.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(report.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (reportForCreateServicePublished.publishAt <= nowTimeStamp) {
            expect(report.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(report.status).toStrictEqual(ReportStatus.Draft);
        }
    });

    it("Success - Draft Report", async () => {
        const report = await service.create(reportForCreateServiceDraft);

        expect(repository.persist).toHaveBeenCalledTimes(2);
        expect(report.id).toHaveLength(36);
        expect(report.userId).toStrictEqual(reportForCreateServiceDraft.userId);
        expect(report.title).toStrictEqual(reportForCreateServiceDraft.title);
        expect(report.content).toStrictEqual(reportForCreateServiceDraft.content);
        expect(report.publishAt).toStrictEqual(reportForCreateServiceDraft.publishAt);
        expect(report.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(report.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (reportForCreateServiceDraft.publishAt <= nowTimeStamp) {
            expect(report.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(report.status).toStrictEqual(ReportStatus.Draft);
        }
    });
});
