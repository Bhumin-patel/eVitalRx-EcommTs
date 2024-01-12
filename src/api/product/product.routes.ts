import express from 'express';
import * as controller from './product.controller';

const Router: express.Router = express.Router();

Router.post('/filter', controller.filter);

export default Router;