import CandidatePullBaseError from './CandidatePullBaseError';

export default class ProcessError extends CandidatePullBaseError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, ProcessError.prototype);
    this.setupDefaultValues(error);
  }
}
