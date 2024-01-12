import { pool } from '../postgresql';
import { QueryResult } from 'pg';

export const filter = async (
    id?: number,
    name?: string,
    product_category?: number,
    mrp?: number,
    store_id?: number,
    page?: number,
    size?: number
): Promise<QueryResult> =>{
  
    let query: string = `   select products.*,store_id 
                            from products join store_inventory
                            on products.id = store_inventory.product_id`;
    
    let whereClause: string[]=[];

    if(id){
        whereClause.push(`products.id = ${id}`);
    }
    if(name){
        whereClause.push(`lower(name) like lower('%${name}%')`);
    }
    if(product_category){
        whereClause.push(`product_category = ${product_category}`);
    }
    if(mrp){
        whereClause.push(`mrp <= ${mrp}`);
    }
    if(store_id){
        whereClause.push(`store_id = ${store_id}`);
    }

    if(whereClause.length > 0){
        query = ` ${query} where ${whereClause.join(` and `)}`;
    }

    if(page && size){
        query = `${query} order by products.id limit ${size} offset ${(page-1)*size}`
    }

    return await pool.query(query);
};