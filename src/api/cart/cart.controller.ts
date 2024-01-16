import {Request,Response} from 'express';
import * as global from '../../types/global';
import { response } from '../../utils/response';
import { validation } from '../../utils/validation';
import * as cartValidation from './cart.validation';
import * as cartService from '../../models/services/cart.service';
import { QueryResult } from 'pg';

export const add = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(cartValidation.add,requestData);
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

        const allowRoles: string[] = ["super-admin","admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let check: QueryResult = await cartService.selectItemFromCart(user_id,requestData.product_id);

        if(check.rows.length === 1){
            return response(res, false, 400, 'Product is already in the cart!');
        }

        let data: QueryResult = await cartService.add(  user_id,
                                                        requestData.quantity,
                                                        requestData.product_id,
                                                        requestData.store_id);

        return response(res, true, 200, 'Product is added in the cart!', data.rows[0]);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};

export const listCartItems = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(cartValidation.listCartItems,requestData);
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

        const allowRoles: string[] = ["super-admin","admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let data: QueryResult = await cartService.selectCartItems(user_id);

        return response(res, true, 200, 'Cart item list', data.rows);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};

export const updateCartItem = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(cartValidation.updateCartItem,requestData);
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

        const allowRoles: string[] = ["super-admin","admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let data: QueryResult = await cartService.updateCartItem(requestData.product_id,
                                                                requestData.quantity,
                                                                user_id);
        
        if(data.rows.length === 0){
            return response(res, false, 400, 'Cart item does not exist!');
        }

        return response(res, true, 200, 'Cart item is updated successfully!', data.rows[0]);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};

export const deleteCartItem = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(cartValidation.deleteCartItem,requestData);
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

        const allowRoles: string[] = ["super-admin","admin","user"];
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	}

        let product_id: number = Number(req.params.productId);

        let data: QueryResult = await cartService.deleteCartItem(product_id,
                                                                user_id);
        
        if(data.rows.length === 0){
            return response(res, false, 400, 'Cart item does not exist!');
        }

        return response(res, true, 200, 'Cart item is deleted successfully!', data.rows[0]);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};