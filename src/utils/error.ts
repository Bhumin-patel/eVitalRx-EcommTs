import { Request,Response,NextFunction } from 'express';
import { response } from './response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return response(res, false, 500, 'Something went wrong', {error: err.message});
}