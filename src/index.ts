import express from 'express';
import './models/postgresql';
// import guard from './utils/guard';
import cors from 'cors';
import { config } from './config/default';
import authRoutes from './api/auth/auth.routes';
import productRoutes from './api/product/product.routes';
import * as guard from './utils/guard';
import { errorHandler } from './utils/error'

export{};

const app = express();
const port: number = config.PORT || 3000;

let corsOptions : cors.CorsOptions = {
    origin: ['http://localhost:3000'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/product' , guard.verifyToken, productRoutes);
app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})