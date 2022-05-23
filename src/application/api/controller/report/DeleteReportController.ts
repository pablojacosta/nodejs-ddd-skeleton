import { paramIdValidator } from "application/api/validator/paramIdValidator";
import { TYPES } from "application/config/ioc/types";
import { Report } from "domain/entity/Report";
import { IReportRepository } from "domain/repository/ReportRepository";
import { IRemoveReportService } from "domain/service/report/RemoveReportService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, request, response } from "inversify-express-utils";

/**
 * @swagger
 * /reports/{id}:
 *    delete:
 *      summary: Remove Report
 *      tags: [Reports]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Report id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: The Report was deleted
 *        404:
 *          description: The Report was not found
 *
 */
@controller("/reports")
export class DeleteReportController extends BaseHttpController {
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;
    @inject(TYPES.RemoveReportService) private readonly removeReportService: IRemoveReportService;

    @httpDelete("/:id", TYPES.AuthorizationMiddleware, ...paramIdValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const report: Report | null = await this.reportRepository.findOneById(request.params.id);

        if (report === null) {
            return response.status(404).send({ error: `Report with id: ${request.params.id} not found` });
        }

        await this.removeReportService.remove(report);

        return response.status(204).send();
    }
}
