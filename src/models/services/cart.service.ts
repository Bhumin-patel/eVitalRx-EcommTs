import { pool } from '../postgresql';
import { QueryResult } from 'pg';

export const selectItemFromCart = async (
    user_id: number,
    product_id: number
): Promise<QueryResult> => {
    
    let query: string = `   select *
                            from carts
                            where user_id = $1 and product_id = $2`;
    let queryInput: number[] = [
        user_id,
        product_id
    ];

    return await pool.query(query, queryInput);
};

export const add = async (
    user_id: number,
    quantity: number,
    product_id: number,
    store_id: number,
): Promise<QueryResult> => {
    let query = `   INSERT INTO carts ( user_id, 
                                        quantity,  
                                        product_id, 
                                        store_id,
                                        created_at) 
                    VALUES($1,$2,$3,$4,$5) returning *;
    `;
    let currentTS: Date = new Date();

    let queryInput: (number | Date)[] = [
        user_id,
        quantity,
        product_id,
        store_id,
        currentTS
    ];

    return await pool.query(query, queryInput);
};

export const selectCartItems = async (
    user_id: number
): Promise<QueryResult> => {
    
    let query: string = `   select *
                            from carts join products
                            on carts.product_id = products.id
                            where user_id = $1`;
    let queryInput: number[] = [
        user_id
    ];

    return await pool.query(query, queryInput);
};

export const updateCartItem = async (
    product_id: number,
    quantity: number,
    user_id: number
): Promise<QueryResult> => {
    
    let query: string = `   update carts
                            set quantity = $1
                            where product_id = $2 and user_id = $3
                            returning *`;
    let queryInput: number[] = [
        quantity,
        product_id,
        user_id
    ];

    return await pool.query(query, queryInput);
};