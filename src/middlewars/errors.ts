import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from '../utils/const';

export default (
  (err: {statusCode: number, message: string}, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
          ? 'На сервере произошла ошибка'
          : message,
      });
    next();
  });
