import { Joi, celebrate } from 'celebrate';
import { urlRegEx } from '../utils/const';

const createCardValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegEx).required(),
  }),
});

const getCardValidation = celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export default { createCardValidation, getCardValidation };
