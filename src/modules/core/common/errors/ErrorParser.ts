import { injectable } from 'inversify';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';

export enum ErrorPolicy {
  AllowErrorInList,
  DenyErrorInList
}

@injectable()
export default class ErrorParser {
  public parseError(error: any): string {
    return !isNullOrUndefined(error) ? JSON.stringify(error) : 'undefined';
  }

  public canErrorBeRetried(error: any, errorList: string[], filterPolicy: ErrorPolicy = ErrorPolicy.DenyErrorInList): boolean {
    const systemError: string = this.parseError(error);
    const errorIsFound: boolean = this.existsErrorInList(systemError, errorList);

    return this.validateFilterPolicy(errorIsFound, filterPolicy);
  }

  private existsErrorInList(errorToFind: string, errorList: string[]): boolean {
    errorList = isNullOrUndefined(errorList) ? [] : errorList;
    return errorList.findIndex((x: string) => errorToFind.indexOf(x) > -1) > -1;
  }

  private validateFilterPolicy(foundInList: boolean, filterPolicy: ErrorPolicy): boolean {
    switch (filterPolicy) {
      case ErrorPolicy.AllowErrorInList:
        return foundInList;
      case ErrorPolicy.DenyErrorInList:
        return !foundInList;
      default: {
        return !foundInList;
      }
    }
  }
}
