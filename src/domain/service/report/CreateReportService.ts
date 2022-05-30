import { inject } from "inversify";
import { Report, ReportStatus } from "../../entity/Report";
import { ServiceValidationException } from "../../exception/ServiceValidationException";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { TYPES } from "application/config/ioc/types";
import { IUserRepository } from "domain/repository/UserRepository";
import { IReportRepository } from "domain/repository/ReportRepository";
import { IIdGeneratorService } from "../IdGeneratorService";

/**
 * @swagger
 * components:
 *   schemas:
 *     ICreateReportDto:
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
export interface ICreateReportDto {
    userId: string;
    title: string;
    content: string;
    status: ReportStatus;
    publishAt: number;
}

export interface ICreateReportService {
    create(dto: ICreateReportDto): Promise<Report>;
}

@provideSingleton(TYPES.CreateReportService)
export class CreateReportService implements ICreateReportService {
    constructor(
        @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository,
        @inject(TYPES.IdGenerator) private readonly idGenerator: IIdGeneratorService,
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository
    ) {}

    public async create({ userId, title, content, publishAt }: ICreateReportDto): Promise<Report> {
        if (!(await this.userRepository.findOneById(userId))) {
            throw new ServiceValidationException(`User with id: ${userId} doesn't exist`);
        }

        const generateStatus = publishAt <= ((Date.now() / 1000) | 0) ? ReportStatus.Published : ReportStatus.Draft;

        const timestamp = (Date.now() / 1000) | 0;

        const report: Report = {
            id: this.idGenerator.generateId(),
            userId,
            title,
            content,
            status: generateStatus,
            publishAt,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        await this.reportRepository.persist(report);

        return report;
    }
}
