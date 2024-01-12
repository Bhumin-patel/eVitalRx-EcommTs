import { Response } from "express";
import * as global from '../types/global';
import { object } from "joi";

export const response = (
    res: Response,
    success: boolean = true,
    statusCode: number = 200,
    message: string = "",
    data: Record<string,any> = {}
): Response<global.CustomResponse> => {

    const resData: global.CustomResponse = {
        success,
        statusCode,
        message,
        data,
    };
    
    return res.status(statusCode).send(resData);
};
