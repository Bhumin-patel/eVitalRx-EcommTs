import * as bcrypt from 'bcrypt';
import { response } from '../../utils/response';
import * as authService from '../../models/services/auth.service';
import { createJWTToken } from '../../utils/guard';
import { Request,Response } from 'express';
import { validation } from '../../utils/validation';
import * as authValidation from './auth.validation';
import * as global from '../../types/global';


export const signup = async (req: Request, res: Response): global.cotrollerRes =>{
    try{
        let requestdata = req.body;

        const validateReq: global.validationResponse = validation(authValidation.signup,requestdata);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let { rows:newRows } = await authService.selectByEmail(requestdata.email);

        if(newRows.length === 1){
            return response(res, false, 400, 'Email already exists!');
        }

        requestdata.password = await bcrypt.hash(requestdata.password, 8);
        requestdata.phone = requestdata.phone? requestdata.phone : null;

        let { rows } = await authService.addUser(   requestdata.first_name,
                                                    requestdata.last_name,
                                                    requestdata.email,
                                                    requestdata.phone,
                                                    requestdata.password,
                                                    requestdata.user_role,
                                                    requestdata.user_profile_picture
                                                );
     
        let token: string = await createJWTToken({
            id: rows[0].id,
			role: rows[0].user_role,
        });

        return response(res, true, 201, 'signup successfully!', { data: rows[0], token});  
    } catch(error){
        console.log('---Error in signup :',error);
        return response(res,false,500, 'Something went wrong!', {Error: error});
    }
};

export const signin = async (req: Request, res: Response): global.cotrollerRes =>{
    try{
        let requestdata = req.body;

        const validateReq: global.validationResponse = validation(authValidation.signin,requestdata);
        if(!validateReq.isValid){
            return response(res, false, 400, 'Request data is invalid.', validateReq.error);
        }

        let { rows } = await authService.selectByEmail(requestdata.email);

        if(rows.length === 0){
            return response(res, false, 400, 'user with this email does not exist!');
        }

        let isMatch: boolean = await bcrypt.compare(requestdata.password, rows[0].password);

        if (!isMatch) {
            return response(res, false, 401, 'email or password is incorrect!');
        }

        let token: string = await createJWTToken({
            id: rows[0].id,
			role: rows[0].user_role,
        });

        return response(res, true, 200, 'signin successfully!', {data: rows[0], token});
    } catch(error){
        console.log('---Error in signup :',error);
        return response(res,false,500, 'Something went wrong!', {Error: error});
    }
};