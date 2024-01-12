import * as joi from 'joi';

export const filter = joi.object({
    id: joi.number().allow(),
    name: joi.string().max(100).allow(),
    product_category: joi.number().allow(),
    mrp: joi.number().allow(),
    store_id: joi.number().allow() 
});