import { Response, Request } from "express";
import { inject } from "inversify";
import { controller, httpPut, response, request } from "inversify-express-utils";
import { TYPES } from "application/config/ioc/types";
import { validatePutExample } from "application/api/validator/validatePutExample";
import { IExampleRepository } from "domain/repository/ExampleRepository";
import { IUpdateExampleService, UpdateExampleDto } from "domain/service/example/UpdateExampleService";

/**
 * @swagger
 * /examples/{id}:
 *   put:
 *     summary: Update example by id
 *     tags: [Examples]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: example id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExampleDto'
 *     responses:
 *       200:
 *         decsription: The example was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Example'
 *       404:
 *         description: example was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
@controller("/examples")
export class PutExampleController {
    @inject(TYPES.ExampleRepository) private readonly repository: IExampleRepository;
    @inject(TYPES.UpdateExampleService) private readonly service: IUpdateExampleService;

    @httpPut("/:id", ...validatePutExample)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const example = await this.repository.findOneById(Number(request.params.id));

        if (!example) {
            return response.status(404).send({ error: "Example not found" });
        }

        await this.service.update(example, request.body as UpdateExampleDto);

        return response.status(200).send(example);
    }
}
