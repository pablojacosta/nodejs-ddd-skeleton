import { Response, Request } from "express";
import { inject } from "inversify";
import { controller, httpGet, response, request } from "inversify-express-utils";
import { TYPES } from "application/config/ioc/types";
import { IExampleRepository, SortDirection } from "domain/repository/ExampleRepository";
import { validateGetExamples } from "application/api/validator/validateGetExamples";

/**
 * @swagger
 * /examples:
 *   get:
 *     summary: Get Examples
 *     tags: [Examples]
 *     parameters:
 *       - in: query
 *         name: value
 *         description: example value
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
 *     responses:
 *       200:
 *         description: the list of the examples
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Example'
 */
@controller("/examples")
export class GetExamplesController {
    @inject(TYPES.ExampleRepository) private readonly repository: IExampleRepository;

    @httpGet("/", ...validateGetExamples)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const { value, offset, limit, sort, direction } = request.query;

        const examples = await this.repository.findPaginated(
            Number(offset) ?? 0,
            Number(limit) ?? 20,
            sort?.toString() ?? "value",
            (direction as SortDirection) ?? "desc",
            value?.toString()
        );

        return response.status(200).send(examples);
    }
}
