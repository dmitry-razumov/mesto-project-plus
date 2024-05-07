import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, JWT_SECRET } from '../utils/const';
import BadRequest from '../errors/bad-request';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new ConflictError('Email уже существует'));
      }
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value:any) => value.message);
        return next(new BadRequest(JSON.stringify(message)));
      }
      return next(err);
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => (
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next)
);

export const getUserById = (req: Request, res: Response, next: NextFunction) => (
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип userId'));
      }
      return next(err);
    })
);

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value:any) => value.message);
        return next(new BadRequest(JSON.stringify(message)));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип userId'));
      }
      return next(err);
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value:any) => value.message);
        return next(new BadRequest(JSON.stringify(message)));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип userId'));
      }
      return next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => next(err));
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id ?? req.params.userId;
  return User.findById(userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип userId'));
      }
      return next(err);
    });
};
