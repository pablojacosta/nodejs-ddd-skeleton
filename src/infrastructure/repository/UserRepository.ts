import { MongoRepository } from "infrastructure/mongodb/MongoRepository";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { inject } from "inversify";
import { TYPES } from "application/config/ioc/types";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { IUserRepository } from "domain/repository/UserRepository";
import { User } from "domain/entity/User";

export const collectionName: string = "user";

@provideSingleton(TYPES.UserRepository)
export class UserRepository extends MongoRepository implements IUserRepository {
    constructor(@inject(TYPES.ConnectionManager) connectionManager: IConnectionManager) {
        super();
        this.collection = connectionManager.getCollection(collectionName);
    }

    public async findAllPaginated(offset: number, limit: number, age?: number, country?: string): Promise<User[]> {
        const filter: { [key: string]: unknown } = {};

        if (age) {
            filter.age = age;
        }

        if (country) {
            filter.country = country;
        }

        return await this.findBy(filter, null, offset, limit);
    }

    public async findOneById(id: string): Promise<User | null> {
        return await this.findOneBy({ id });
    }
}
