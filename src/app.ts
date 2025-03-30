import 'reflect-metadata';
import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import errorMiddleware from './middlewares/errorMiddleware';
import routes from './routes';

// Load env variables
dotenv.config();

// Initialize TypeORM datasource using database config
const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/models/*.entity{.ts,.js}'],
    synchronize: true,

});

dataSource.initialize().then(() => {
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
}).catch(error => console.error('DB Connection Error:', error));
