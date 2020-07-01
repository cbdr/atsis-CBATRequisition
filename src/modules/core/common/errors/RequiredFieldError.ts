import CandidatePullBaseError from './CandidatePullBaseError';

export default class RequiredFieldError extends CandidatePullBaseError {
  public constructor(error: any, private fieldName: string) {
    super(error);
    Object.setPrototypeOf(this, RequiredFieldError.prototype);
    this.setupDefaultValues(error);
  }
}
