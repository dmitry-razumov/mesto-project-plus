import { HTTP_STATUS_CONFLICT_ERROR } from '../utils/const';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT_ERROR;
  }
}

export default ConflictError;
