import CandidatePullBaseError from './CandidatePullBaseError';

export default class AuthError extends CandidatePullBaseError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, AuthError.prototype);
    this.setupDefaultValues(error);
  }
}
