import { HTTP_STATUS_BAD_REQUEST } from '../utils/const';

class BadRequest extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

export default BadRequest;
