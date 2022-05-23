import { User } from "../entity/User";

export interface IUserRepository {
    persist(user: User): Promise<void>;
    findAllPaginated(offset: number, limit: number, age?: number, country?: string): Promise<User[]>;
    findOneById(id: string): Promise<User | null>;
    remove(user: User): Promise<void>;
}
