import { HTTP_STATUS_UNAUTHORIZED_ERROR } from '../utils/const';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED_ERROR;
  }
}

export default UnauthorizedError;
