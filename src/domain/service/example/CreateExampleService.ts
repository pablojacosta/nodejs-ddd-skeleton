import { ServiceValidationException } from "domain/exception/ServiceValidationException";
import { inject } from "inversify";
import { TYPES } from "../../../application/config/ioc/types";
import { provideSingleton } from "../../../infrastructure/inversify/CustomProviders";
import { Example } from "../../entity/Example";
import { IExampleRepository } from "../../repository/ExampleRepository";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateExampleDto:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *           description: Value of example
 *       example:
 *         value: "Mr. Robot"
 *
 */
export interface CreateExampleDto {
    id: number; // NOTE: as this is an example of a service, we recommend using auto-generated IDs, e.g. UUID
    value: string;
}

export interface ICreateExampleService {
    create(dto: CreateExampleDto): Promise<Example>;
}

@provideSingleton(TYPES.CreateExampleService)
export class CreateExampleService implements ICreateExampleService {
    constructor(@inject(TYPES.ExampleRepository) private readonly repository: IExampleRepository) {}

    public async create({ id, value }: CreateExampleDto): Promise<Example> {
        if (await this.repository.findOneById(id)) {
            throw new ServiceValidationException(`Example with id ${id} already exists`);
        }

        const timestamp = (Date.now() / 1000) | 0;

        const example: Example = { id, value, createdAt: timestamp, updatedAt: timestamp };

        await this.repository.persist(example);

        return example;
    }
}
