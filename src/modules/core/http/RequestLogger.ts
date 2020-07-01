import Logger from '../logging/Logger';
import { HttpParameters, Request, FileFormat } from '../../npm/Request';
import { injectable } from 'inversify';
import Timer from '../time/Timer';

@injectable()
export class RequestLogger extends Request {

  public constructor(
    private request: Request,
    private logger: Logger,
    private timer: Timer) {
    super();
  }

  public async call(option: any): Promise<any> {
    const logger: Logger = this.logger.enterNewFile(__filename);
    try {
      logger.addContext({ uri: option.uri, method: option.method, description: option.description});
      logger.debug('Will invoke api', {request: option});
      let response: any;
      const secs: number = await this.timer.apply(async () => {
        response = await this.request.call(option);
      });
      logger.debug('Api response', { uri: option.uri, response, elapsedTime: secs });
      return response;
    } catch (err) {
      logger.debug('Http call failed!', err);
      throw err;
    }
  }
}
