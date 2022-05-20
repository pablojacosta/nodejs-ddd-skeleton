import { Response, Request } from "express";
import { inject } from "inversify";
import { controller, httpPost, response, request } from "inversify-express-utils";
import { CreateExampleDto, ICreateExampleService } from "domain/service/example/CreateExampleService";
import { TYPES } from "application/config/ioc/types";
import { validatePostExample } from "application/api/validator/validatePostExample";

/**
 * @swagger
 * /examples:
 *   post:
 *     summary: Create a new example
 *     tags: [Examples]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExampleDto'
 *     responses:
 *       201:
 *         description: The example was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Example'
 *       500:
 *         description: Some server error
 */
@controller("/examples")
export class PostExampleController {
    @inject(TYPES.CreateExampleService) private readonly service: ICreateExampleService;

    @httpPost("/", ...validatePostExample)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const example = await this.service.create(request.body as CreateExampleDto);

        return response.status(201).send(example);
    }
}
