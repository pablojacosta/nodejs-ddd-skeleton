import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { inject } from "inversify";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { TYPES } from "application/config/ioc/types";
import { IIdGeneratorService } from "../IdGeneratorService";

/**
 * @swagger
 * components:
 *   schemas:
 *     ICreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - age
 *         - country
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the User
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
 *         email: "user@example.com"
 *         name: "John Doe"
 *         country: "AR"
 */
export interface ICreateUserDto {
    email: string;
    name: string;
    age: number;
    country: string;
}

export interface ICreateUserService {
    create(dto: ICreateUserDto): Promise<User>;
}

@provideSingleton(TYPES.CreateUserService)
export class CreateUserService implements ICreateUserService {
    private readonly userRepository: IUserRepository;

    @inject(TYPES.IdGenerator) private readonly idGenerator: IIdGeneratorService;

    constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async create({ email, name, age, country }: ICreateUserDto): Promise<User> {
        const timestamp = (Date.now() / 1000) | 0;

        const user: User = {
            id: this.idGenerator.generateId(),
            email,
            name,
            age,
            country,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        await this.userRepository.persist(user);

        return user;
    }
}
