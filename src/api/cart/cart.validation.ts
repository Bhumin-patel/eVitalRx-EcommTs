import * as joi from 'joi';

export const add = joi.object({
    quantity: joi.number().required(),
    product_id: joi.number().required(),
    store_id: joi.number().required() 
});

export const listCartItems = joi.object({});

export const updateCartItem = joi.object({
    product_id: joi.number().required(),
    quantity: joi.number().allow()
});