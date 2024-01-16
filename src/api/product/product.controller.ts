import {Request,Response} from 'express';
import { response } from '../../utils/response';
import { validation } from '../../utils/validation';
import * as productValidation from './product.validation';
import * as global from '../../types/global';
import * as productService from '../../models/services/product.service';
import { QueryResult } from 'pg';

export const filter = async (req: global.ModifiedRequest, res: Response): global.cotrollerRes =>{
    try{
        let requestData = req.body;

        const validateReq: global.validationResponse = validation(productValidation.filter,requestData);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let user_role: string = 'dummy';

        if(req.user && req.user.user_role){
            user_role = req.user.user_role;
        }

        const allowRoles: string[] = ["super-admin","admin","user"];
    	
		if (!allowRoles.includes(user_role)) {
      		return response( res, true, 401, 'Unauthorized. Operation is not allowed for you.');
    	} 

        let size: number = 4;
        let page: number = 1;

        if(typeof req.query.page === 'string' ){
            page= Number(req.query.page);
            page= page < 1 ? 1 : page;
        }

        let data: QueryResult = await productService.filter(page,
                                                            size,
                                                            requestData.id,
                                                            requestData.name,
                                                            requestData.product_category,
                                                            requestData.mrp,
                                                            requestData.store_id
                                                            );

        return response(res, true, 200, 'Product list', data.rows);
    } catch(error){
        console.log('---Error in product-filter :',error);
        return response(res, false, 500, 'Something went wrong!', {Error:error});
    }
};