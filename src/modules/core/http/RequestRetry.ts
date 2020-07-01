import { HttpParameters, Request, FileFormat } from '../../npm/Request';
import { injectable } from 'inversify';
import { RequestLogger } from './RequestLogger';
import { retry } from '../utils/Retry';

@injectable()
export class RequestRetry extends Request {

  public constructor(
    private request: RequestLogger
    ) {
    super();
  }

  public async call(option: HttpParameters): Promise<any> {
     return await retry(async () => {
       return await this.request.call(option);
     });
  }

  public async downloadFile(option: HttpParameters, format: FileFormat = null, highWaterMarkInMB: number = 1): Promise<string> {
    return await retry(async () => {
      return "";
    });
 }
}
