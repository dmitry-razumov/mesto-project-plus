import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { defaultUser } from '../utils/const';
import UnauthorizedError from '../errors/unauthorized-error';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserLogin extends mongoose.Model<IUser> {
  findUserByCredentials:
  // eslint-disable-next-line no-unused-vars
  (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, IUserLogin>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля name должна быть 2'],
    maxlength: [30, 'Максимальная длина поля name должна быть 30'],
    default: defaultUser.name,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля about должна быть 2'],
    maxlength: [200, 'Максимальная длина поля about должна быть 200'],
    default: defaultUser.about,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL в поле avatar',
    },
    default: defaultUser.avatar,
  },
  email: {
    type: String,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Email содержит некорректные символы',
    },
    required: [true, 'Поле email не может быть пустым'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле password не может быть пустым'],
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
});
export default mongoose.model<IUser, IUserLogin>('user', userSchema);
