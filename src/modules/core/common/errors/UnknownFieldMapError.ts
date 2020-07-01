import CandidatePullBaseError from './CandidatePullBaseError';

export default class UnknownFieldMapError extends CandidatePullBaseError {
  public constructor(error: any, private fieldName: string, private fieldValue: string) {
    super(error);
    Object.setPrototypeOf(this, UnknownFieldMapError.prototype);
    this.setupDefaultValues(error);
  }
}
