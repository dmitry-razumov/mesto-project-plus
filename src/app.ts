import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { DB_URL, SRV_PORT } from './utils/const';
import errors from './middlewars/errors';

declare global {
  namespace Express {
    interface Request {
      user: { _id: string }
    }
  }
}

const { PORT = SRV_PORT } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '662fe0f03306d3b726d82af9' // вставьте сюда _id созданного пользователя
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errors);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
