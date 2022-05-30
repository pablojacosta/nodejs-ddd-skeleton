import { UpdateUserService } from "domain/service/user/UpdateUserService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { UserRepository } from "infrastructure/repository/UserRepository";
import { nowTimeStamp, userForPut, users } from "tests/Helpers";

jest.mock("infrastructure/repository/UserRepository");

describe("Update User Service", () => {
    const repository = new UserRepository({} as IConnectionManager);
    const service = new UpdateUserService(repository);

    it("Success", async () => {
        const user = await service.update(users[0], userForPut);
        const { createdAt } = users[0];

        expect(repository.persist).toHaveBeenCalledTimes(1);
        expect(user.name).toStrictEqual(userForPut.name);
        expect(user.age).toStrictEqual(userForPut.age);
        expect(user.country).toStrictEqual(userForPut.country);
        expect(user.createdAt).toStrictEqual(createdAt);
        expect(user.updatedAt).toBeGreaterThanOrEqual(nowTimeStamp);
    });
});
