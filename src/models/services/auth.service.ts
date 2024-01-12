import { promises } from 'dns';
import { pool } from '../postgresql';
import { QueryResult } from 'pg';
import {User} from '../../types/global'

export const selectByEmail = async (email: string): Promise<QueryResult<User>> => {
    let query: string = `select * from users where email = $1`;
    
    let queryInput: [string] = [
        email
    ];

    return await pool.query(query,queryInput);
};

export const addUser = async (  
    first_name: string, 
    last_name: string, 
    email: string, 
    phone: string, 
    password: string, 
    user_role: string, 
    user_profile_picture: string
): Promise<QueryResult<User>>  => {
    let query = `insert into users (first_name,
                                    last_name,
                                    email,
                                    phone,
                                    password,
                                    user_role,
                                    user_profile_picture,
                                    created_at)
                values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;

    let currentTS: Date = new Date();

    let queryInput = [
        first_name,
        last_name,
        email,
        phone,
        password,
        user_role,
        user_profile_picture,
        currentTS
    ];

    return await pool.query(query,queryInput);
};