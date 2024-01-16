import {Request} from 'express';

export interface ModifiedRequest extends Request {
    user?: User
}

export interface User {
    id: number,
    first_name?: string,
    last_name?: string,
    email?: string,
    phone?: string,
    password: string,
    otp?: number,   
    is_admin?: boolean,
    user_role: string,
    user_profile_picture?: string,
    created_at?: string,
    updated_at?: string,
    otp_expire?: string
}

export interface validationResponse {
    isValid: boolean,
    error: joi.ValidationError | undefined;
}

export interface CustomResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Record<string, any>;
}

export type cotrollerRes = Promise<Response<global.CustomResponse>>;

export interface placeOrderRes {
    error: boolean;
    error_message: string,
    order: any,
    order_products: any[]
}

export interface cartResponse {
    id: number,
    user_id: number,
    quantity: number,
    product_id: number,
    store_id: number,
    created_at: timestamp,
    updated_at: timestamp
}