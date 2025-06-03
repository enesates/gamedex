import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the GameDex API!');
});

export default app;
