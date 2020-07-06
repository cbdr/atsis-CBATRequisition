import * as AWS from 'aws-sdk';
import { injectable } from 'inversify';
import * as path from 'path';
import logger from '../core/logging/Logger'
import * as _ from 'lodash';

@injectable()
export default class SNS {
  private candidateLogger: logger;
  private sns: AWS.SNS;

  public constructor(candidateLogger: logger) {
    this.sns = new AWS.SNS({ region: process.env.REGION });
    this.candidateLogger = candidateLogger.enterNewFile(`${path.basename(__filename)}`);
  }
  public async publishMessage(region: string, inputParams: AWS.SNS.PublishInput): Promise<AWS.SNS.PublishResponse> {
    const sns: AWS.SNS = new AWS.SNS({ region });
    return await sns.publish(inputParams).promise();
  }

  public getMessage(event: any): any {
    if (!event || !event.Records || !event.Records[0] || !event.Records[0].Sns || !event.Records[0].Sns.Message) {
      this.candidateLogger.addContext(_.get(event, 'loggingContext'));
      return null;
    }
    const message: string = event.Records[0].Sns.Message;
    return JSON.parse(message);
  }
}
