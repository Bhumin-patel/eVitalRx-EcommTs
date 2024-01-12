import * as joi from 'joi';
import * as global from '../types/global';

export const validation = (schema: joi.Schema, object: Record<string, any>): global.validationResponse => { 
	
    let isValid = schema.validate(object);

    if(isValid.hasOwnProperty('error')){
        return { isValid: false, error: isValid.error };
    } else {
        return { isValid: true, error: undefined };
    }
}