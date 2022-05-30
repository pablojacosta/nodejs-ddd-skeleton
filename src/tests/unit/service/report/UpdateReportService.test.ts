import { UpdateReportService } from "domain/service/report/UpdateReportService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { ReportRepository } from "infrastructure/repository/ReportRepository";
import { nowTimeStamp, reportForUpdateService, reports } from "tests/Helpers";
import { UserRepository } from "infrastructure/repository/UserRepository";

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

    it("Success", async () => {
        const report = await service.update(reports[0], reportForUpdateService);
        const { createdAt } = reports[0];

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(report.userId).toStrictEqual(reportForUpdateService.userId);
        expect(report.title).toStrictEqual(reportForUpdateService.title);
        expect(report.content).toStrictEqual(reportForUpdateService.content);
        expect(report.publishAt).toStrictEqual(reportForUpdateService.publishAt);
        expect(report.status).toStrictEqual(reportForUpdateService.status);
        expect(report.createdAt).toStrictEqual(createdAt);
        expect(report.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);
    });
});
