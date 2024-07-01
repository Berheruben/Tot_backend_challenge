import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './dataSource';
import userRoutes from './routes/userRoutes';
import reservationRoutes from './routes/reservationRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', reservationRoutes);

app.use(errorMiddleware);

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database', error);
    });
