import { TYPES } from "application/config/ioc/types";
import { Report } from "domain/entity/Report";
import { User } from "domain/entity/User";
import { IReportRepository } from "domain/repository/ReportRepository";
import { IUserRepository } from "domain/repository/UserRepository";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, request, response } from "inversify-express-utils";
import { getReportsValidator } from "../../validator/report/getReportsValidator";

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get Reports
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: Id of the User that created the Reports
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         description: offset records to return
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         description: max records to return
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: dateFrom
 *         description: Get Reports created from dateFrom onwards
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: dateTo
 *         description: Get Reports created on dateTo and before dateTo
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: the list of the Reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 */
@controller("/reports")
export class GetReportsController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;

    @httpGet("/", ...getReportsValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        if (request.query.userId) {
            const user: User | null = await this.userRepository.findOneById(request.query.userId.toString());

            if (user === null) {
                return response.status(400).send({ error: `User with id: ${request.query.userId} doesn't exist` });
            }
        }

        const reports: Report[] = await this.reportRepository.findAllFilteredAndPaginated(
            Number(request.query.offset ?? 0),
            Number(request.query.limit ?? 20),
            request.query.userId?.toString(),
            Number(request.query.dateFrom),
            Number(request.query.dateTo)
        );

        return response.status(200).send(reports);
    }
}
