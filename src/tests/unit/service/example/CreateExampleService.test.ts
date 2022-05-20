// This test is only an example of how to do Unit testing and mock dependencies
import { CreateExampleService } from "domain/service/example/CreateExampleService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { ExampleRepository } from "infrastructure/repository/ExampleRepository";

jest.mock("infrastructure/repository/ExampleRepository");

describe("Create Example Service", () => {
    const repository = new ExampleRepository({} as IConnectionManager);
    const service = new CreateExampleService(repository);

    it("Success", async () => {
        const example = await service.create({ id: 1, value: "test" });

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(example.id).toEqual(1);
        expect(example.value).toEqual("test");
    });
});
