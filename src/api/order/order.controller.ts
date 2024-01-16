import * as global from '../../types/global';
import { response } from '../../utils/response';
import { validation } from '../../utils/validation';
import * as orderValidation from './order.validation';
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import * as orderService from '../../models/services/order.service';
import * as cartService from '../../models/services/cart.service';

export const placeOrder = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(orderValidation.placeOrder,requestData);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let user_role: string = 'dummy';

        if(req.user && req.user.user_role){
            user_role = req.user.user_role;
        }

        let user_id: number = -1;

        if(req.user && req.user.id){
            user_id = req.user.id;
        }

        const allowRoles: string[] = ["super-admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        const data: QueryResult = await cartService.selectCartItems(user_id);

        if(data.rows.length === 0){
            return response(res, false, 400, 'Cart is Empty. Please add product!');
        }

        let orderData: global.placeOrderRes = await orderService.placeOrder( user_id, 
                                                                    requestData.address_id,
                                                                    requestData.coupon_id,
                                                                    data.rows);
        
        if(orderData.error){
            return response(res, false, 400, orderData.error_message);
        }
        
        return response(
            res, 
            true, 
            200, 
            'Order is placed successfully!', 
            {order: orderData.order, order_product : orderData.order_products}
            );
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};

export const cancelOrder = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(orderValidation.cancelOrder,requestData);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let user_role: string = 'dummy';

        if(req.user && req.user.user_role){
            user_role = req.user.user_role;
        }

        let user_id: number = -1;

        if(req.user && req.user.id){
            user_id = req.user.id;
        }

        const allowRoles: string[] = ["super-admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let order_id: number = Number(req.params.id);

        let data: QueryResult = await orderService.cancelOrder(order_id,user_id);

        if(data.rows.length === 0){
            return response(res, true, 404, 'order does not found!');
        }

        return response(res, true, 200, 'order is canceled successfully!', data.rows);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};

export const filterOrder = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(orderValidation.filterOrder,requestData);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let user_role: string = 'dummy';

        if(req.user && req.user.user_role){
            user_role = req.user.user_role;
        }

        let user_id: number = -1;

        if(req.user && req.user.id){
            user_id = req.user.id;
        }

        const allowRoles: string[] = ["super-admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let data = await orderService.filterOrder(  user_id,
                                                    requestData.id,
                                                    requestData.payment_status,
                                                    requestData.order_status,
                                                    requestData.address_id);

        return response(res, true, 200, 'Order List!', data.rows);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};

export const listOrderItem = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(orderValidation.listOrderItem,requestData);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let user_role: string = 'dummy';

        if(req.user && req.user.user_role){
            user_role = req.user.user_role;
        }

        let user_id: number = -1;

        if(req.user && req.user.id){
            user_id = req.user.id;
        }

        const allowRoles: string[] = ["super-admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let order_id: number = Number(req.params.order_id);

        let checkData = await orderService.selectOrder(order_id,user_id);

        if(checkData.rows.length === 0){
            return response(res, false, 400, 'you can not view this order\'s items');
        }

        let data = await orderService.listOrderItem(order_id);

        return response(res, true, 200, 'Order items!', data.rows);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};