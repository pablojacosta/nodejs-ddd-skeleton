export class AppException extends Error {
    protected _message: string;
    protected _code: number;

    constructor(message: string = "", code: number = 500) {
        super();

        this._message = message;
        this._code = code;
    }

    public get message(): string {
        return this._message;
    }

    public get code(): number {
        return this._code;
    }
}
