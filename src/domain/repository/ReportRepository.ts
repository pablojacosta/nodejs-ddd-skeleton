import { Report } from "../entity/Report";

export interface IReportRepository {
    persist(report: Report): Promise<void>;
    findAllFilteredAndPaginated(
        offset: number,
        limit: number,
        userId?: string,
        dateFrom?: number,
        dateTo?: number
    ): Promise<Report[]>;
    findOneById(id: string): Promise<Report | null>;
    findAllReports(): Promise<Report[]>;
    remove(report: Report): Promise<void>;
}
