import { DomainException } from "./DomainException";

export class ServiceValidationException extends DomainException {
    constructor(message: string) {
        super(message, 400);
    }
}
