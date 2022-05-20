import { Response } from "express";
import { controller, httpGet, response } from "inversify-express-utils";

@controller("/")
export class GetHomeController {
    @httpGet("/")
    public get(@response() response: Response): void {
        response.send({ message: "NodeJS DDD Skeleton" });
    }
}
