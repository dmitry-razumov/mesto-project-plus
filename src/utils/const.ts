import 'dotenv/config';

const crypto = require('crypto');

export const SRV_PORT = 3000;

export const DB_URL = 'mongodb://localhost:27017/mestodb';

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED_ERROR = 401;
export const HTTP_STATUS_FORBIDDEN_ERROR = 403;
export const HTTP_STATUS_NOT_FOUND_ERROR = 404;
export const HTTP_STATUS_CONFLICT_ERROR = 409;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const defaultUser = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

const randomString = crypto.randomBytes(16).toString('hex');
export const JWT_SECRET = process.env.JWT_SECRET || randomString;

export const urlRegEx: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
