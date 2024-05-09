import { NextFunction, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
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
      if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
        return next(new ConflictError('Email уже существует'));
      }
      if (err instanceof Error.ValidationError) {
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch((err) => next(err));
};

const findUser = (userId: string, req: Request, res: Response, next: NextFunction) => {
  User.findById(userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => next(err));
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  findUser(req.user._id, req, res, next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  findUser(req.params.userId, req, res, next);
};

type TUserUpdateDto = {
  name?: string,
  about?: string,
  avatar?: string
}

const updateUserFields = (dto: TUserUpdateDto, req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user._id,
    dto,
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        const message = Object.values(err.errors).map((value:any) => value.message);
        return next(new BadRequest(JSON.stringify(message)));
      }
      return next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  updateUserFields({ name, about }, req, res, next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  updateUserFields({ avatar }, req, res, next);
};
