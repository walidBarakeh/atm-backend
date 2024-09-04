export enum ErrorCodes {
    Ok = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    TimeOut = 408,
    Conflict = 409,
    UnprocessableEntity = 422,
    InternalServerError = 500,
}

export class InvalidParamsError extends Error { }

export class HttpError extends Error {
    public statusCode: ErrorCodes;

    public errorDetails: Record<string, any>;

    constructor(statusCode: ErrorCodes, message: string, errorDetails?: any) {
        super();
        this.statusCode = statusCode;
        this.errorDetails = errorDetails || {};
        this.message = message;
    }
}
