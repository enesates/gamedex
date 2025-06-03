import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/client';

const app = express();
const port = process.env.PORT || 5000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the GameDex API!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});