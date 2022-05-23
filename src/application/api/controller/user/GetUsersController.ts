import { TYPES } from "application/config/ioc/types";
import { User } from "domain/entity/User";
import { IUserRepository } from "domain/repository/UserRepository";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, request, response } from "inversify-express-utils";
import { getUsersValidator } from "../../validator/user/getUsersValidator";

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get Users
 *     tags: [Users]
 *     parameters:
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
 *         name: age
 *         description: User's age
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: country
 *         description: User's country
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: the list of the Users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
@controller("/users")
export class GetUsersController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;

    @httpGet("/", ...getUsersValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const users: User[] = await this.userRepository.findAllPaginated(
            Number(request.query.offset ?? 0),
            Number(request.query.limit ?? 20),
            Number(request.query.age),
            request.query.country?.toString()
        );

        return response.status(200).send(users);
    }
}
