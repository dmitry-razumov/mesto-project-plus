import { NextFunction, Request, Response } from 'express';
import Card from '../models/cards';
import BadRequest from '../errors/bad-request';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from '../utils/const';
import NotFoundError from '../errors/not-found-error';

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  if (!name || !link) {
    return next(new BadRequest('Некорректные параметры запроса'));
  }

  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch(next);
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
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Нет карточки с таким id'));
      }
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Нет карточки с таким id'));
      }
      return res.status(HTTP_STATUS_OK).send(card);
    })
    .catch(next);
};
