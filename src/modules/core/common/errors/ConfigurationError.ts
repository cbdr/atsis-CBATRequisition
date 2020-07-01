import CandidatePullBaseError from './CandidatePullBaseError';

export default class ConfigurationError extends CandidatePullBaseError {
  public constructor(error: any) {
    super(error);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
    this.setupDefaultValues(error);
  }
}
