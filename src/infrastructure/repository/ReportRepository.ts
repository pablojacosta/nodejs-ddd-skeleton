import { TYPES } from "application/config/ioc/types";
import { Report, ReportStatus } from "domain/entity/Report";
import { IReportRepository } from "domain/repository/ReportRepository";
import { provideSingleton } from "infrastructure/inversify/CustomProviders";
import { IConnectionManager } from "infrastructure/mongodb/ConnectionManager";
import { MongoRepository } from "infrastructure/mongodb/MongoRepository";
import { inject } from "inversify";

const collectionName: string = "report";

@provideSingleton(TYPES.ReportRepository)
export class ReportRepository extends MongoRepository implements IReportRepository {
    constructor(@inject(TYPES.ConnectionManager) connectionManager: IConnectionManager) {
        super();
        this.collection = connectionManager.getCollection(collectionName);
    }

    public async findAllFilteredAndPaginated(
        offset: number,
        limit: number,
        userId?: string,
        dateFrom?: number,
        dateTo?: number
    ): Promise<Report[]> {
        const filter: { [key: string]: unknown } = {};

        userId ? (filter.userId = userId) : {};

        if (dateFrom && dateTo) {
            filter.createdAt = { $gte: dateFrom };
            filter.updatedAt = { $lte: dateTo };
        } else if (dateFrom && !dateTo) {
            filter.createdAt = { $gte: dateFrom };
        } else if (!dateFrom && dateTo) {
            filter.updatedAt = { $lte: dateTo };
        }

        return await this.findBy(filter, null, offset, limit);
    }

    public async findOneById(id: string): Promise<Report | null> {
        return await this.findOneBy({ id });
    }

    public async findPendingToPublish(): Promise<Report[]> {
        const filter: { [key: string]: unknown } = {};
        filter.status = ReportStatus.Draft;
        filter.publishAt = { $lte: (Date.now() / 1000) | 0 };

        return await this.findBy(filter);
    }
}
