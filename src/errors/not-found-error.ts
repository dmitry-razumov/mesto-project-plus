import { HTTP_STATUS_NOT_FOUND_ERROR } from '../utils/const';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND_ERROR;
  }
}

export default NotFoundError;
