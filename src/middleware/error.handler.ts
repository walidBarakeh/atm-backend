import { NextFunction, Request, Response } from 'express';
import { ErrorCodes, HttpError, InvalidParamsError } from '../config/consts';


export const handleErrorWithStatus = (error: any, req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ error: error.message, ...error.errorDetails });
    } else if (error instanceof InvalidParamsError) {
        return res.status(ErrorCodes.BadRequest).json({ error: error.message });
    }
    else {
        const response = { error: `${(error as Error).message}` || 'internal server error', s: (error as Error).stack };
        console.error(error);
        if (error?.response?.data) {
            response.error = `${response.error}, ${error?.response?.data}`;
        }
        res.status(500).json({ response });
    }
    res.end();
};
