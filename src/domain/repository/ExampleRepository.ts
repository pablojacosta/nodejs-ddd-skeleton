import { Example } from "../entity/Example";

export type SortDirection = "asc" | "desc";

export interface IExampleRepository {
    findPaginated(
        offset: number,
        limit: number,
        sort: string,
        direction: SortDirection,
        value?: string
    ): Promise<Example[]>;
    findOneById(id: number): Promise<Example | null>;
    findOneByValue(value: string): Promise<Example | null>;
    persist(example: Example): Promise<void>;
    remove(example: Example): Promise<void>;
}
