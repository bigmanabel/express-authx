import 'reflect-metadata';
import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { connectMongo } from './config/database.config';
import errorMiddleware from './middlewares/errorMiddleware';
import routes from './routes';

// Load env variables
dotenv.config();

connectMongo().then(() => {
    const app = express();
    app.use(json());

    // mount routers
    app.use('/', routes);

    // error handling middleware
    app.use(errorMiddleware);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
    });
}).catch(error => console.error('MongoDB Connection Error:', error));
