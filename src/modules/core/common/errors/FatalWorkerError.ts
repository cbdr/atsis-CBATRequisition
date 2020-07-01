import CandidatePullBaseError from './CandidatePullBaseError';

export default class FatalWorkerError extends CandidatePullBaseError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, FatalWorkerError.prototype);
    this.setupDefaultValues(error);
  }
}
