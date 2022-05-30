import { inject } from "inversify";
import { ServiceValidationException } from "../../exception/ServiceValidationException";
import { Report, ReportStatus } from "../../entity/Report";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { TYPES } from "application/config/ioc/types";
import { IUserRepository } from "domain/repository/UserRepository";
import { IReportRepository } from "domain/repository/ReportRepository";

/**
 * @swagger
 * components:
 *   schemas:
 *     IUpdateReportDto:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - content
 *         - status
 *         - publishAt
 *       properties:
 *         userId:
 *           type: string
 *           description: The id of the User that created the Report
 *         title:
 *           type: string
 *           description: The title of the Report
 *         content:
 *           type: string
 *           description: The content of the Report
 *         status:
 *           type: ReportStatus
 *           description: The status of the Report (draft or published)
 *         publishAt:
 *           type: number
 *           description: The Report's publish date (Unix Timestamp)
 *       example:
 *         userId: "12345"
 *         title: "Example title"
 *         content: "Example content"
 *         status: draft
 *         publishAt: 1653065246
 */
export interface IUpdateReportDto {
    userId: string;
    title: string;
    content: string;
    status: ReportStatus;
    publishAt: number;
}

export interface IUpdateReportService {
    update(report: Report, dto: IUpdateReportDto): Promise<Report>;
}

@provideSingleton(TYPES.UpdateReportService)
export class UpdateReportService implements IUpdateReportService {
    constructor(
        @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository,
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository
    ) {}

    public async update(report: Report, { userId, title, content, publishAt }: IUpdateReportDto): Promise<Report> {
        if (!(await this.userRepository.findOneById(userId))) {
            throw new ServiceValidationException(`User with id: ${userId} doesn't exist`);
        }

        const generateStatus = publishAt <= ((Date.now() / 1000) | 0) ? ReportStatus.Published : ReportStatus.Draft;

        report.status = generateStatus;

        report.title = title;
        report.content = content;
        report.publishAt = publishAt;
        report.updatedAt = (Date.now() / 1000) | 0;

        await this.reportRepository.persist(report);

        return report;
    }
}
