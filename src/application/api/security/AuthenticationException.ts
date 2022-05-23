import { AppException } from "application/exception/AppException";

const DEFAULT_MESSAGE: string = "Authorization required";

export class AuthenticationException extends AppException {
    constructor(message?: string) {
        super(message ?? DEFAULT_MESSAGE, 401);
    }
}
