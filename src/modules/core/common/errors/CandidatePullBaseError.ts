export default class CandidatePullBaseError extends Error {
  public originalErrorStack: any;
  public categorizedErrorType: string;
  public originalErrorMessage: string;
  public constructor(error: any) {
    super(error);
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, CandidatePullBaseError.prototype);
  }

  public setupDefaultValues(error: any): void {
    this.originalErrorMessage = error.message || error;
    this.categorizedErrorType = this.constructor.name;
    this.originalErrorStack = error.stack;
  }
}
