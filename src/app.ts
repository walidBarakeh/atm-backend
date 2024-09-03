import express from 'express';
import atmRoutes from './routes/atmRoutes';

const app = express();

app.use(express.json());
app.use('/atm', atmRoutes);

export default app;
