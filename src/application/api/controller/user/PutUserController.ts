import { paramIdValidator } from "application/api/validator/paramIdValidator";
import { TYPES } from "application/config/ioc/types";
import { User } from "domain/entity/User";
import { IUserRepository } from "domain/repository/UserRepository";
import { IUpdateUserDto, IUpdateUserService } from "domain/service/user/UpdateUserService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPut, request, response } from "inversify-express-utils";
import { putUserValidator } from "../../validator/user/putUserValidator";

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update User by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IUpdateUserDto'
 *     responses:
 *       200:
 *         description: The User was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User was not found.
 *       500:
 *         description: Some error happened.
 *
 */
@controller("/users")
export class PutUserController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.UpdateUserService) private readonly updateUserService: IUpdateUserService;

    @httpPut("/:id", TYPES.AuthorizationMiddleware, ...paramIdValidator, ...putUserValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.params.id);

        if (user === null) {
            return response.status(404).send({ error: `User with id: ${request.params.id} not found` });
        }

        await this.updateUserService.update(user, request.body as IUpdateUserDto);

        return response.status(200).send(user);
    }
}
