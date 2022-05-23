import { paramIdValidator } from "application/api/validator/paramIdValidator";
import { TYPES } from "application/config/ioc/types";
import { User } from "domain/entity/User";
import { IUserRepository } from "domain/repository/UserRepository";
import { IRemoveUserService } from "domain/service/user/RemoveUserService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, request, response } from "inversify-express-utils";

/**
 * @swagger
 * /users/{id}:
 *    delete:
 *      summary: Remove User
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: User id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: The User was deleted
 *        404:
 *          description: The User was not found
 *
 */
@controller("/users")
export class DeleteUserController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.RemoveUserService) private readonly removeUserService: IRemoveUserService;

    @httpDelete("/:id", TYPES.AuthorizationMiddleware, ...paramIdValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.params.id);

        if (user === null) {
            return response.status(404).send({ error: `User with id: ${request.params.id} not found` });
        }

        await this.removeUserService.remove(user);

        return response.status(204).send();
    }
}
