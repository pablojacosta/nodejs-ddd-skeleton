import { Response, Request } from "express";
import { inject } from "inversify";
import { controller, httpGet, response, request } from "inversify-express-utils";
import { TYPES } from "application/config/ioc/types";
import { IExampleRepository } from "domain/repository/ExampleRepository";

/**
 * @swagger
 * /examples/{id}:
 *   get:
 *     summary: Get one Example
 *     tags: [Examples]
 *     parameters:
 *        - in: path
 *          name: id
 *          description: example id
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: the example
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Example'
 */
@controller("/examples")
export class GetExampleController {
    @inject(TYPES.ExampleRepository) private readonly repository: IExampleRepository;

    @httpGet("/:id")
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const example = await this.repository.findOneById(Number(request.params.id));

        if (!example) {
            return response.status(404).send({ error: "Example not found" });
        }

        return response.status(200).send(example);
    }
}
