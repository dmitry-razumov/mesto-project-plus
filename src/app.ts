import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { JwtPayload } from 'jsonwebtoken';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewars/logger';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { DB_URL, SRV_PORT } from './utils/const';
import errorsMidleware from './middlewars/errors';
import NotFoundError from './errors/not-found-error';
import { createUser, login } from './controllers/users';
import auth from './middlewars/auth';
import validators from './validators/users';

const { PORT = SRV_PORT } = process.env;
const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
}

app.use(requestLogger);

app.use('/signin', validators.loginValidation, login);
app.use('/signup', validators.createUserValidation, createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorsMidleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
