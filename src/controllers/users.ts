import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from '../utils/const';
import BadRequest from '../errors/bad-request';
import NotFoundError from '../errors/not-found-error';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
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
