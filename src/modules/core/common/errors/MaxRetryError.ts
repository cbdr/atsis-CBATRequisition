import CandidatePullBaseError from './CandidatePullBaseError';

export default class MaxRetryError extends CandidatePullBaseError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, MaxRetryError.prototype);
    this.setupDefaultValues(error);
  }
}
