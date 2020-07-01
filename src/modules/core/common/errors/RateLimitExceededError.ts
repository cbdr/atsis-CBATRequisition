import FatalWorkerError from './FatalWorkerError';

export default class RateLimitExceededError extends FatalWorkerError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, RateLimitExceededError.prototype);
    this.setupDefaultValues(error);
  }
}
