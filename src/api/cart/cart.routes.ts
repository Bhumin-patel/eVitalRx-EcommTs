import express from 'express';
import * as controller from './cart.controller';

const Router: express.Router = express.Router();

Router.post('/add', controller.add);
Router.get('/list-cart-items', controller.listCartItems);
Router.post('/update-cart-item', controller.updateCartItem);

export default Router;