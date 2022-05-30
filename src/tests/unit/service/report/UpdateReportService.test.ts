import { UpdateReportService } from "domain/service/report/UpdateReportService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { ReportRepository } from "infrastructure/repository/ReportRepository";
import { nowTimeStamp, reportForUpdateServiceDraft, reportForUpdateServicePublished, reports } from "tests/Helpers";
import { UserRepository } from "infrastructure/repository/UserRepository";
import { ReportStatus } from "domain/entity/Report";

jest.mock("infrastructure/repository/UserRepository", () => ({
    UserRepository: jest.fn().mockImplementation(() => ({
        findOneById: () => "25c7e026-00f4-4127-a1a6-2365318ec253",
    })),
}));

jest.mock("infrastructure/repository/ReportRepository");

describe("Create Report Service", () => {
    const repository = new ReportRepository({} as IConnectionManager);
    const userRepository = new UserRepository({} as IConnectionManager);
    const service = new UpdateReportService(repository, userRepository);

    it("Success - Published Report", async () => {
        const report = await service.update(reports[0], reportForUpdateServicePublished);
        const { createdAt } = reports[0];

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(report.userId).toStrictEqual(reportForUpdateServicePublished.userId);
        expect(report.title).toStrictEqual(reportForUpdateServicePublished.title);
        expect(report.content).toStrictEqual(reportForUpdateServicePublished.content);
        expect(report.publishAt).toStrictEqual(reportForUpdateServicePublished.publishAt);
        expect(report.createdAt).toStrictEqual(createdAt);
        expect(report.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (reportForUpdateServicePublished.publishAt <= nowTimeStamp) {
            expect(report.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(report.status).toStrictEqual(ReportStatus.Draft);
        }
    });

    it("Success - Draft Report", async () => {
        const report = await service.update(reports[0], reportForUpdateServiceDraft);
        const { createdAt } = reports[0];

        expect(repository.persist).toHaveBeenCalledTimes(2);
        expect(report.userId).toStrictEqual(reportForUpdateServiceDraft.userId);
        expect(report.title).toStrictEqual(reportForUpdateServiceDraft.title);
        expect(report.content).toStrictEqual(reportForUpdateServiceDraft.content);
        expect(report.publishAt).toStrictEqual(reportForUpdateServiceDraft.publishAt);
        expect(report.createdAt).toStrictEqual(createdAt);
        expect(report.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);

        if (reportForUpdateServiceDraft.publishAt <= nowTimeStamp) {
            expect(report.status).toStrictEqual(ReportStatus.Published);
        } else {
            expect(report.status).toStrictEqual(ReportStatus.Draft);
        }
    });
});
