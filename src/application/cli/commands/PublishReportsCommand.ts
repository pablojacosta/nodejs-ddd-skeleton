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
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;

    public async execute(): Promise<void> {
        const reports: Report[] = await this.reportRepository.findAllReports();

        reports.forEach((report) => this.publishReportsService.publishReport(report));

        // Estas dos líneas de código que siguen las usé de control, para ver que funcionara
        // pero si las saco no se updatea la db. Si las dejo, funciona perfecto.
        // Entiendo que es el await al repository lo q lo hace funcionar, pero no entiendo
        // por qué es necesario.

        const reportsAfter: Report[] = await this.reportRepository.findAllReports();
        console.log(reportsAfter);

        writeSuccess("Reports Published");
    }
}
