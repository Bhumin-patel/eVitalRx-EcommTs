import express from 'express';
import * as controller from './auth.controller';

const Router: express.Router = express.Router();

Router.post('/signup', controller.signup);
Router.post('/signin', controller.signin);
// Router.post('/forget-password', validation.forgetPassword, controller.forgetPassword);
// Router.post('/reset-forget-password', validation.resetForgetPassword, controller.resetForgetPassword);

export default Router;