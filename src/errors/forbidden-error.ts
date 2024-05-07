import { HTTP_STATUS_FORBIDDEN_ERROR } from '../utils/const';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
