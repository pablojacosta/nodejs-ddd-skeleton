import { PARAMETERS } from "application/config/ioc/parameters";
import { TYPES } from "application/config/ioc/types";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { inject } from "inversify";
import { Collection, Db, MongoClient } from "mongodb";

export interface IConnectionManager {
    connect(): Promise<void>;
    getCollection(name: string): Collection;
    close(): Promise<void>;
}

@provideSingleton(TYPES.ConnectionManager)
export class ConnectionManager implements IConnectionManager {
    private client: MongoClient;
    private dbName: string;
    private db: Db | null = null;

    constructor(@inject(PARAMETERS.mongoDbUrl) url: string, @inject(PARAMETERS.mongoDbDatabase) dbName: string) {
        this.client = new MongoClient(url);
        this.dbName = dbName;
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
    }

    public async close(): Promise<void> {
        await this.client.close();
    }

    public getCollection(name: string): Collection {
        if (this.db === null) {
            throw new Error("Client not connected");
        }

        return this.db.collection(name);
    }
}
