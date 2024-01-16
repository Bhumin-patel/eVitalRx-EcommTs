import express from 'express';
import * as controller from './order.controller';

const Router: express.Router = express.Router();

Router.post('/place-order', controller.placeOrder);
Router.delete('/cancel-order/:id', controller.cancelOrder);
Router.post('/filter-order', controller.filterOrder);
Router.get('/list-order-item/:order_id', controller.listOrderItem);

export default Router;