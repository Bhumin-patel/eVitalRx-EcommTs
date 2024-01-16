import * as joi from 'joi';

export const placeOrder = joi.object({
    address_id: joi.number().required(),
    coupon_id : joi.number().allow() 
});

export const cancelOrder = joi.object({});

export const filterOrder = joi.object({
    id: joi.number().allow(),
    payment_status: joi.boolean().allow(),
    order_status: joi.string().valid('PROCESSING', 
                                    'DISPATCHED', 
                                    'DELIVERED', 
                                    'CANCELED', 
                                    'RETURNED')
                                .allow(),
    address_id: joi.number().allow()
});

export const listOrderItem = joi.object({});