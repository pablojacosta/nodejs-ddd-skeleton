import { RemoveUserService } from "domain/service/user/RemoveUserService";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { UserRepository } from "infrastructure/repository/UserRepository";
import { nowTimeStamp, userForPut, users } from "tests/Helpers";

jest.mock("infrastructure/repository/UserRepository");

describe("Remove User Service", () => {
    const repository = new UserRepository({} as IConnectionManager);
    const service = new RemoveUserService(repository);

    it("Success", async () => {
        await service.remove(users[0]);

        expect(repository.remove).toHaveBeenCalledTimes(1);
    });
});
