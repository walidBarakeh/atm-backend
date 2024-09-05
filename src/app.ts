import express from 'express';
import atmRoutes from './routes/atmRoutes';
import isAliveRoute from './routes/isAlive';
import { handleErrorWithStatus } from './middleware/error.handler';

const app = express();

app.use(express.json());
app.use('/atm', atmRoutes);
app.use('/is_alive', isAliveRoute);
app.use(handleErrorWithStatus);

export default app;
