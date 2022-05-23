import { TYPES } from "application/config/ioc/types";
import { Report } from "domain/entity/Report";
import { User } from "domain/entity/User";
import { IUserRepository } from "domain/repository/UserRepository";
import { ICreateReportDto, ICreateReportService } from "domain/service/report/CreateReportService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPost, request, response } from "inversify-express-utils";
import { postAndPutReportValidator } from "../../validator/report/postAndPutReportValidator";

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a new Report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICreateReportDto'
 *     responses:
 *       201:
 *         description: The Report was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       500:
 *         description: Some server error
 */
@controller("/reports")
export class PostReportController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.CreateReportService) private readonly createReportService: ICreateReportService;

    @httpPost("/", TYPES.AuthorizationMiddleware, ...postAndPutReportValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.body.userId);

        if (user === null) {
            return response.status(400).send({ error: `User with id: ${request.body.userId} doesn't exist` });
        }

        const report: Report = await this.createReportService.create(request.body as ICreateReportDto);

        return response.status(201).send(report);
    }
}
