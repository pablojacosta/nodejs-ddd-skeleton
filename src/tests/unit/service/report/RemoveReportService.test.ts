import { RemoveReportService } from "domain/service/report/RemoveReportService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { ReportRepository } from "infrastructure/repository/ReportRepository";
import { nowTimeStamp, reportForPostPublished, reports } from "tests/Helpers";

jest.mock("infrastructure/repository/ReportRepository");

describe("Remove Report Service", () => {
    const repository = new ReportRepository({} as IConnectionManager);
    const service = new RemoveReportService(repository);

    it("Success", async () => {
        await service.remove(reports[0]);

        expect(repository.remove).toHaveBeenCalledTimes(1);
    });
});
