import { CreateUserService } from "domain/service/user/CreateUserService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { UserRepository } from "infrastructure/repository/UserRepository";
import { nowTimeStamp, userForPost } from "tests/Helpers";
import { IdGenerator } from "infrastructure/idGenerator/IdGenerator";

jest.mock("infrastructure/idGenerator/IdGenerator", () => ({
    IdGenerator: jest.fn().mockImplementation(() => ({
        generateId: () => "00000000-0000-0000-0000-000000000000",
    })),
}));

jest.mock("infrastructure/repository/UserRepository");

describe("Create User Service", () => {
    const repository = new UserRepository({} as IConnectionManager);
    const idGenerator = new IdGenerator();
    const service = new CreateUserService(repository, idGenerator);

    it("Success", async () => {
        const user = await service.create(userForPost);

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(user.id).toHaveLength(36);
        expect(user.email).toStrictEqual(userForPost.email);
        expect(user.name).toStrictEqual(userForPost.name);
        expect(user.age).toStrictEqual(userForPost.age);
        expect(user.country).toStrictEqual(userForPost.country);
        expect(user.createdAt).toBeGreaterThanOrEqual(nowTimeStamp);
        expect(user.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);
    });
});
