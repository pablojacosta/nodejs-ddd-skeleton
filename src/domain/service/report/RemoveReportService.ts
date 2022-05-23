import { TYPES } from "application/config/ioc/types";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { inject } from "inversify";
import { Report } from "../../entity/Report";
import { IReportRepository } from "../../repository/ReportRepository";

export interface IRemoveReportService {
    remove(report: Report): Promise<void>;
}

@provideSingleton(TYPES.RemoveReportService)
export class RemoveReportService implements IRemoveReportService {
    constructor(@inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository) {}

    public async remove(report: Report): Promise<void> {
        await this.reportRepository.remove(report);
    }
}
