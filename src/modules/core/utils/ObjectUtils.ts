import * as _ from 'lodash';
import { injectable } from 'inversify';
import { isNullOrUndefined } from 'util';
import * as traverse from 'traverse';
import RequiredFieldError from '../common/errors/RequiredFieldError';

@injectable()
export default class ObjectUtils {
  public  removeEmptyFields<T>(obj: T): T {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] && typeof obj[key] === 'object') {
        this.removeEmptyFields(obj[key]);
        if (obj[key].filter) {
          obj[key] = obj[key].filter((v: any) => !this.isNull(v));
        }
        if (_.isEmpty(obj[key])) {
          delete obj[key];
        }
      } else if (this.isEmptyString(obj[key])) {
        delete obj[key];
      }
    });
    return obj;
  }

  public  isNull(obj: any): boolean {
    return obj === null || obj === undefined;
  }

  public  isEmptyString(strVal: string): boolean {
    if (this.isNull(strVal)) {
      return true;
    }
    if (!_.isString(strVal)) {
      return false;
    }
    const trimmed: string = strVal.trim();
    return trimmed === '';
  }

  public isArrayEmpty(arrayObj: any[]): boolean {
    if (this.isNull(arrayObj) || (arrayObj.constructor === Array && arrayObj.length === 0)) {
      return true;
    }

    if (arrayObj instanceof Array) {
      const value: any = arrayObj.find((element: any) => !this.isNull(element));
      return this.isNull(value);
    }

    return false;
  }

  public redact(context: any, forbiddenFields: string[]): any {
    const traversable: any = traverse(context);
    return traversable.map(function(): any {
      if (!isNullOrUndefined(this.key) && forbiddenFields.indexOf(this.key.toLowerCase()) > -1) {
        this.update('[ REDACTED ]');
      }
    });
  }

  public getRequiredField(obj: object, fieldPath: string ): any {
    const value: any = _.get(obj, fieldPath);
    if (isNullOrUndefined(value) || value === '') {
      throw new RequiredFieldError('Field is required', fieldPath);
    }
    return value;
  }

  public isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
}
