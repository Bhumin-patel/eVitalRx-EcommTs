import * as jwt from 'jsonwebtoken';
import { pool } from '../models/postgresql';
import { config } from '../config/default';
import { Request, Response, NextFunction } from 'express';
import * as global from '../types/global';
import { QueryResult } from 'pg';

interface Payload {
    id: number,
    role: string
}

interface tokenRes {
    token: string,
    error: boolean
}

interface JwtDecode {
    id: number,
    role: string
}

export const createJWTToken = async (payload: Payload): Promise<string> => {
	let token: string = await jwt.sign(payload, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRE,
	});
	return token;
};

export const verifyToken = async (req: global.ModifiedRequest, res: Response , next: NextFunction): Promise<void> => {
	try{
		if(req.headers.authorization === undefined){
            const error = new Error('Unauthorized. please login!');
            return next(error);
		}

		const token: string = req.headers.authorization.split(" ")[1];
		const decoded: string | jwt.JwtPayload = jwt.verify(token, config.JWT_SECRET);

		if(typeof decoded === 'string'){
            const error = new Error(decoded);
            return next(error);
        } 
            
        let query: string = `select * from users where id = $1`;
		let queryInput: [number] = [
			decoded.id
		];
            
        let data: QueryResult<global.User>  = await pool.query(query,queryInput);
		req.user = data.rows[0];
		return next();
	} catch (error){
        return next(error);
	}
}