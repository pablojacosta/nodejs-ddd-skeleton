import { paramIdValidator } from "application/api/validator/paramIdValidator";
import { TYPES } from "application/config/ioc/types";
import { Report } from "domain/entity/Report";
import { IReportRepository } from "domain/repository/ReportRepository";
import { IUpdateReportDto, IUpdateReportService } from "domain/service/report/UpdateReportService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPut, request, response } from "inversify-express-utils";
import { postAndPutReportValidator } from "../../validator/report/postAndPutReportValidator";

/**
 * @swagger
 * /reports/{id}:
 *   put:
 *     summary: Update Report by id
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Report id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IUpdateReportDto'
 *     responses:
 *       200:
 *         description: The Report was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report was not found.
 *       500:
 *         description: Some error happened.
 *
 */
@controller("/reports")
export class PutReportController extends BaseHttpController {
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;
    @inject(TYPES.UpdateReportService) private readonly updateReportService: IUpdateReportService;

    @httpPut("/:id", TYPES.AuthorizationMiddleware, ...paramIdValidator, ...postAndPutReportValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const report: Report | null = await this.reportRepository.findOneById(request.params.id);

        if (report === null) {
            return response.status(404).send({ error: `Report with id: ${request.params.id} not found` });
        }

        await this.updateReportService.update(report, request.body as IUpdateReportDto);

        return response.status(200).send(report);
    }
}
