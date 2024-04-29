import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from '../utils/const';
import BadRequest from '../errors/bad-request';
import NotFoundError from '../errors/not-found-error';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return next(new BadRequest('Некорректные параметры запроса'));
  }

  return User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => (
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next)
);

export const getUserById = (req: Request, res: Response, next: NextFunction) => (
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next)
);

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  if (!name || !about) {
    return next(new BadRequest('Некорректные параметры запроса'));
  }
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(() => next(new BadRequest('Данные не прошли валидацию')));
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    return next(new BadRequest('Некорректные параметры запроса'));
  }
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(() => next(new BadRequest('Данные не прошли валидацию')));
};
