import { CreateReportService } from "domain/service/report/CreateReportService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { ReportRepository } from "infrastructure/repository/ReportRepository";
import { nowTimeStamp, reportForCreateService } from "tests/Helpers";
import { IdGenerator } from "infrastructure/idGenerator/IdGenerator";
import { UserRepository } from "infrastructure/repository/UserRepository";

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

    it("Success", async () => {
        const report = await service.create(reportForCreateService);

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(report.id).toHaveLength(36);
        expect(report.userId).toStrictEqual(reportForCreateService.userId);
        expect(report.title).toStrictEqual(reportForCreateService.title);
        expect(report.content).toStrictEqual(reportForCreateService.content);
        expect(report.publishAt).toStrictEqual(reportForCreateService.publishAt);
        expect(report.status).toStrictEqual(reportForCreateService.status);
        expect(report.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(report.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);
    });
});
