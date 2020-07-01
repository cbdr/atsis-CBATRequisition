import * as request from 'request-promise';
import { UriOptions } from 'request';
import { injectable } from 'inversify';
import { isNullOrUndefined } from 'util';

interface IHttpIntention {
  description: string;
}

export type HttpParameters = (UriOptions & request.RequestPromiseOptions & IHttpIntention);

export type FileFormat = 'base64' | 'utf8';

@injectable()
export class Request {
  public async call(options: HttpParameters): Promise<any> {
    return request(options);
  }
}
