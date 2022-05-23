import { TYPES } from "application/config/ioc/types";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { inject } from "inversify";
import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";

export interface IRemoveUserService {
    remove(user: User): Promise<void>;
}

@provideSingleton(TYPES.RemoveUserService)
export class RemoveUserService implements IRemoveUserService {
    constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

    public async remove(user: User): Promise<void> {
        await this.userRepository.remove(user);
    }
}
