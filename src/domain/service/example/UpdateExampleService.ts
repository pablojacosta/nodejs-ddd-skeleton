import { inject } from "inversify";
import { TYPES } from "../../../application/config/ioc/types";
import { provideSingleton } from "../../../infrastructure/inversify/CustomProviders";
import { Example } from "../../entity/Example";
import { IExampleRepository } from "../../repository/ExampleRepository";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateExampleDto:
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
export interface UpdateExampleDto {
    value: string;
}

export interface IUpdateExampleService {
    update(example: Example, dto: UpdateExampleDto): Promise<Example>;
}

@provideSingleton(TYPES.UpdateExampleService)
export class UpdateExampleService implements IUpdateExampleService {
    constructor(@inject(TYPES.ExampleRepository) private readonly repository: IExampleRepository) {}

    public async update(example: Example, { value }: UpdateExampleDto): Promise<Example> {
        example.value = value;
        example.updatedAt = (Date.now() / 1000) | 0;

        await this.repository.persist(example);

        return example;
    }
}
