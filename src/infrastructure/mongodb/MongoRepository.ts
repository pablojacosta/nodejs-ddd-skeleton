import { injectable } from "inversify";
import { Collection, ObjectId, SortDirection, WithId } from "mongodb";

export interface IMongoRepository {
    findOneBy<T>(filter: { [key: string]: unknown }): Promise<T | null>;
    findBy<T>(
        filter: { [key: string]: unknown },
        sort?: { [key: string]: SortDirection } | null,
        offset?: number | null,
        limit?: number | null
    ): Promise<T[]>;
    findAll<T>(
        sort?: { [key: string]: SortDirection } | null,
        offset?: number | null,
        limit?: number | null
    ): Promise<T[]>;
    persist<T>(document: T): Promise<void>;
    remove<T>(document: T): Promise<void>;
}

@injectable()
export class MongoRepository implements IMongoRepository {
    protected collection: Collection;

    public async findOneBy<T>(filter: { [key: string]: unknown }): Promise<T | null> {
        if (filter._id) {
            filter._id = new ObjectId(filter._id as string);
        }

        return await this.collection.findOne<T>(filter);
    }

    public async findBy<T>(
        filter: { [key: string]: unknown },
        sort?: { [key: string]: SortDirection } | null,
        offset?: number | null,
        limit?: number | null
    ): Promise<T[]> {
        const cursor = this.collection.find<T>(filter);

        sort ? cursor.sort(sort) : null;
        offset ? cursor.skip(offset) : null;
        limit ? cursor.limit(limit) : null;

        return await cursor.toArray();
    }

    public async findAll<T>(
        sort?: { [key: string]: SortDirection } | null,
        offset?: number | null,
        limit?: number | null
    ): Promise<T[]> {
        return await this.findBy({}, sort, offset, limit);
    }

    public async persist<T>(document: T): Promise<void> {
        (document as WithId<T>)._id
            ? await this.collection.replaceOne({ _id: (document as WithId<T>)._id }, document)
            : await this.collection.insertOne(document);
    }

    public async remove<T>(document: T): Promise<void> {
        await this.collection.deleteOne({ _id: (document as WithId<T>)._id });
    }
}
