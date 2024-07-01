import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Reservation } from './entities/Reservation';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Reservation],
    migrations: [],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');
    } catch (error:any) {
        console.error('Error during Data Source initialization:', error.message);
        process.exit(1); // Exit process with failure
    }
};