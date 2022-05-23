import { paramIdValidator } from "application/api/validator/paramIdValidator";
import { TYPES } from "application/config/ioc/types";
import { User } from "domain/entity/User";
import { IUserRepository } from "domain/repository/UserRepository";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, request, response } from "inversify-express-utils";

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get one User
 *     tags: [Users]
 *     parameters:
 *        - in: path
 *          name: id
 *          description: User id
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: the User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
@controller("/users")
export class GetUserController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;

    @httpGet("/:id", ...paramIdValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.params.id);

        if (user === null) {
            return response.status(404).send({ error: `User with id: ${request.params.id} not found` });
        }

        return response.status(200).send(user);
    }
}
