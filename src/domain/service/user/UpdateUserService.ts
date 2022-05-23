import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { inject } from "inversify";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { TYPES } from "application/config/ioc/types";

/**
 * @swagger
 * components:
 *   schemas:
 *     IUpdateUserDto:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the User
 *         age:
 *           type: number
 *           description: The age of the User
 *         country:
 *           type: string
 *           description: The country of the User
 *       example:
 *         name: "John Doe"
 *         country: "AR"
 */
export interface IUpdateUserDto {
    name: string;
    age: number;
    country: string;
}

export interface IUpdateUserService {
    update(user: User, dto: IUpdateUserDto): Promise<User>;
}

@provideSingleton(TYPES.UpdateUserService)
export class UpdateUserService implements IUpdateUserService {
    private readonly userRepository: IUserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async update(user: User, { name, age, country }: IUpdateUserDto): Promise<User> {
        user.name = name;
        user.age = age;
        user.country = country;
        user.updatedAt = (Date.now() / 1000) | 0;

        await this.userRepository.persist(user);

        return user;
    }
}
