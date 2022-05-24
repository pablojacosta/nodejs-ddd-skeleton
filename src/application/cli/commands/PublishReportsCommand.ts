import { TYPES } from "application/config/ioc/types";
import { Report } from "domain/entity/Report";
import { IReportRepository } from "domain/repository/ReportRepository";
import { IPublishReportsService } from "domain/service/report/PublishReportsService";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { inject } from "inversify";
import { COMMAND, ICommand } from "../Command";
import { writeSuccess } from "../utils";

@provideSingleton(COMMAND)
export class PublishReportsCommand implements ICommand {
    public name: string = "publishReports";

    @inject(TYPES.PublishReportsService) private readonly publishReportsService: IPublishReportsService;

    public async execute(): Promise<void> {
        const publishedReports = await this.publishReportsService.publishReports();

        writeSuccess(`Reports Published: ${publishedReports.length}`);
    }
}
