import CandidatePullBaseError from './CandidatePullBaseError';

export default class ThrottleLimitError extends CandidatePullBaseError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, ThrottleLimitError.prototype);
    this.setupDefaultValues(error);
  }
}
