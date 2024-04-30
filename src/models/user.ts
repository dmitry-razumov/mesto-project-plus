import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name должна быть 2'],
    maxlength: [30, 'Максимальная длина поля name должна быть 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле about должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля about должна быть 2'],
    maxlength: [200, 'Максимальная длина поля about должна быть 200'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL в поле avatar',
    },
    required: [true, 'Поле avatar должно быть заполнено'],
  },
}, { versionKey: false });

export default mongoose.model<IUser>('user', userSchema);
