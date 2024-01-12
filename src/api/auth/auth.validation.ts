import * as joi from 'joi';

export const signup = joi.object({
    first_name: joi.string().min(2).max(30).required(),

    last_name: joi.string().min(2).max(30).allow(),

    email: joi.string().email().required(),

    password: joi.string().alphanum().min(6).required(),

    phone: joi
      .string()
      .allow(),

    user_role: joi.string().valid("super-admin", "admin", "user").required(),

    user_profile_picture: joi.string().allow(),  
});

export const signin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().alphanum().min(6).required(), 
});