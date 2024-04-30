import { NextFunction, Request, Response } from 'express';
import Card from '../models/cards';
import BadRequest from '../errors/bad-request';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from '../utils/const';
import NotFoundError from '../errors/not-found-error';

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value:any) => value.message);
        return next(new BadRequest(JSON.stringify(message)));
      }
      return next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => (
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next)
);

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .populate('owner')
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип cardId'));
      }
      return next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .populate('owner')
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип cardId или userId'));
      }
      return next(err);
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new NotFoundError('Нет карточки с таким id'))
    .populate('owner')
    .then((card) => {
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан некорректный тип cardId или userId'));
      }
      return next(err);
    });
};
