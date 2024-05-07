import { Router } from 'express';
import {
  getUsers, getUserById, getUser, updateUser, updateAvatar,
} from '../controllers/users';
import validators from '../validators/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validators.getUserByIdValidation, getUserById);
router.patch('/me', validators.updateUserValidation, updateUser);
router.patch('/me/avatar', validators.updateAvatarValidation, updateAvatar);

export default router;
