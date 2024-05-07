import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import validators from '../validators/cards';

const router = Router();

router.get('/', getCards);
router.post('/', validators.createCardValidation, createCard);
router.delete('/:cardId', validators.getCardValidation, deleteCard);
router.put('/:cardId/likes', validators.getCardValidation, likeCard);
router.delete('/:cardId/likes', validators.getCardValidation, dislikeCard);

export default router;
