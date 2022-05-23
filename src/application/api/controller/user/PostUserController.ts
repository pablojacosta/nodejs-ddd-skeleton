import { TYPES } from "application/config/ioc/types";
import { User } from "domain/entity/User";
import { ICreateUserDto, ICreateUserService } from "domain/service/user/CreateUserService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPost, request, response } from "inversify-express-utils";
import { postUserValidator } from "../../validator/user/postUserValidator";

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICreateUserDto'
 *     responses:
 *       201:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
@controller("/users")
export class PostUserController extends BaseHttpController {
    @inject(TYPES.CreateUserService) private readonly createUserService: ICreateUserService;

    @httpPost("/", TYPES.AuthorizationMiddleware, ...postUserValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User = await this.createUserService.create(request.body as ICreateUserDto);

        return response.status(201).send(user);
    }
}
