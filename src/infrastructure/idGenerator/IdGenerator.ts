import { TYPES } from "application/config/ioc/types";
import { IIdGeneratorService } from "domain/service/IdGeneratorService";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { v4 as uuid } from "uuid";

@provideSingleton(TYPES.IdGenerator)
export class IdGenerator implements IIdGeneratorService {
    public generateId(): string {
        const id = uuid();

        return id;
    }
}
