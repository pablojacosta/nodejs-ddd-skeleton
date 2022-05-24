import { inject } from "inversify";
import { Report, ReportStatus } from "../../entity/Report";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { TYPES } from "application/config/ioc/types";
import { IReportRepository } from "domain/repository/ReportRepository";

export interface IPublishReportsService {
    publishReports(): Promise<Report[]>;
}

@provideSingleton(TYPES.PublishReportsService)
export class PublishReportsService implements IPublishReportsService {
    private readonly reportRepository: IReportRepository;

    constructor(@inject(TYPES.ReportRepository) reportRepository: IReportRepository) {
        this.reportRepository = reportRepository;
    }

    public async publishReports(): Promise<Report[]> {
        const reports: Report[] = await this.reportRepository.findPendingToPublish();

        for (const report of reports) {
            report.status = ReportStatus.Published;
            report.updatedAt = (Date.now() / 1000) | 0;

            await this.reportRepository.persist(report);
        }

        return reports;
    }
}
