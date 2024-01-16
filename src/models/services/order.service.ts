import { pool } from '../postgresql';
import { QueryResult } from 'pg';
import * as global from '../../types/global'
import * as cartService from './cart.service';

export const placeOrder = async (
    user_id: number,
    address_id: number,
    coupon_id: number, 
    cartProducts: any
): Promise<global.placeOrderRes> => {
    
    const client = await pool.connect();
    try{
        let mrpData: number[] = [];
        let total_price: number = 0; 

        for await  (let item of cartProducts){
            let query = `   select mrp
                            from products
                            where id = ${item.product_id}`
            let data = await pool.query(query);

            if(data.rows.length === 0){
                return {
                    error: true,
                    error_message: 'Mrp is not found!',
                    order: {},
                    order_products: []
                }
            }
            mrpData.push(data.rows[0].mrp);
            total_price+=data.rows[0].mrp;
        }

        let queryCoupon: string = ` select coupon_amount
                                    from coupons
                                    where id = ${coupon_id}`;
        
        let dataCoupon: QueryResult = await pool.query(queryCoupon);

        if(dataCoupon.rows.length === 0){ 
            return {
                error: true,
                error_message: 'Coupon is not found!',
                order: {},
                order_products: []
            }
        } 

        total_price -= dataCoupon.rows[0].coupon_amount;

        await client.query('BEGIN');

        // insert order
        let queryOrder = `  INSERT INTO orders (    order_amount, 
                                                    payment_status, 
                                                    "order_status", 
                                                    address_id, 
                                                    user_id, 
                                                    created_at) 
                            VALUES($1,$2,$3,$4,$5,$6) returning *; `;
        
        let currentTS: Date = new Date();

        let queryInputOrder = [
            total_price,
            true,
            'PROCESSING',
            address_id,
            user_id,
            currentTS
        ];

        let dataOrder = await client.query(queryOrder,queryInputOrder);

        //insert order item 
        let queryInputOrderItem = cartProducts.map((item: global.cartResponse,index: number)=>{
            return `(
                        ${item.quantity},
                        ${mrpData[index]},
                        ${dataOrder.rows[0].id},
                        ${item.product_id}
                    )`;
        });

        let queryOrderItem= `   INSERT INTO order_products (quantity, 
                                                            product_price, 
                                                            order_id, 
                                                            product_id) 
                                VALUES ${queryInputOrderItem.join(` , `)} returning *`       

        let dataOrderItem = await client.query(queryOrderItem);

        //update stock
        let queryInputUpdateStock = cartProducts.map((item: global.cartResponse)=>{
            return [
                item.quantity,
                item.product_id,
                item.store_id
            ];
        })
        let queryUpdateStock = `    update store_inventory
                                    set stock = stock - $1
                                    where (product_id, store_id) = ($2,$3)`

        for await (let input of queryInputUpdateStock){
            await client.query(queryUpdateStock,input);
        }

        //delete cart
        await cartService.deleteCart(user_id);

        await client.query('COMMIT');

        return {
            error:false,
            error_message: 'Order is placed successfully!',
            order: dataOrder.rows[0],
            order_products: dataOrderItem.rows
        };
    } catch (error){
        await client.query('ROLLBACK');
        console.log('---Error in order-placeOrder-service :',error);
        return {
            error:true,
            error_message: 'Something went wrong!',
            order: {},
            order_products: []
        };
    }
};

export const cancelOrder = async (
    order_id: number,
    user_id: number
): Promise<QueryResult> => {
    
    let query: string = `   update orders
                            set order_status = 'CANCELED'
                            where id = $1 and user_id = $2 returning *`;
    let queryInput: number[] = [
        order_id,
        user_id
    ];

    return await pool.query(query, queryInput);
};

export const selectOrder = async (
    order_id: number,
    user_id: number
): Promise<QueryResult> => {
    
    let query: string = `   select *
                            from orders
                            where id = $1 and user_id = $2`;
    let queryInput: number[] = [
        order_id,
        user_id
    ];

    return await pool.query(query, queryInput);
};

export const listOrderItem = async (
    order_id: number
): Promise<QueryResult> => {
    
    let query: string = `   select *
                            from order_products join products
                            on order_products.product_id = products.id
                            where order_id = $1`;
    let queryInput: number[] = [
        order_id
    ];

    return await pool.query(query, queryInput);
};

export const filterOrder = async (
    user_id: number,
    page: number,
    size: number,
    order_id?: number,
    payment_status?: boolean,
    order_status?: string,
    address_id?: number
): Promise<QueryResult> => {
    
    let query: string = `   select *
                            from orders
                            where user_id = ${user_id}`;
    
    let whereClause: string[] = [];

    if(order_id){
        whereClause.push(`id = ${order_id}`);
    }
    if(payment_status){
        whereClause.push(`payment_status = ${payment_status}`);
    }
    if(order_status){
        whereClause.push(`order_status = '${order_status}'`);
    }
    if(address_id){
        whereClause.push(`address_id = ${address_id}`);
    }

    if(whereClause.length > 0){
        query = `${query} and ${whereClause.join(` and `)}`
    }

    query = `${query} order by created_at desc limit ${size} offset ${(page-1)*size}`

    return await pool.query(query);
};