import * as uuid from 'uuid/v4';
import { injectable } from 'inversify';

@injectable()
export default class UUID {
  public generateUUID(): string {
     return uuid();
  }
}
