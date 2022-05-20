import { Response, Request } from "express";
import { inject } from "inversify";
import { controller, httpDelete, response, request } from "inversify-express-utils";
import { TYPES } from "application/config/ioc/types";
import { IExampleRepository } from "domain/repository/ExampleRepository";

/**
 * @swagger
 * /examples/{id}:
 *    delete:
 *      summary: Remove example
 *      tags: [Examples]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: example id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: The example was deleted
 *        404:
 *          description: The example was not found
 *
 */
@controller("/examples")
export class DeleteExampleController {
    @inject(TYPES.ExampleRepository) private readonly repository: IExampleRepository;

    @httpDelete("/:id")
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const example = await this.repository.findOneById(Number(request.params.id));

        if (!example) {
            return response.status(404).send({ error: "Example not found" });
        }

        await this.repository.remove(example);

        return response.status(204).send();
    }
}
