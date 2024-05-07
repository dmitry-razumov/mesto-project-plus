import { Joi, celebrate } from 'celebrate';
import { urlRegEx } from '../utils/const';

const getUserByIdValidation = celebrate({
  params: Joi.object({
    userId: Joi.string().length(24).hex().required,
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegEx),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object({
    avatar: Joi.string().pattern(urlRegEx).required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export default {
  getUserByIdValidation,
  updateUserValidation,
  updateAvatarValidation,
  createUserValidation,
  loginValidation,
};
