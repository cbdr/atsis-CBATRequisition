import * as AWS from 'aws-sdk';
import { injectable } from 'inversify';

@injectable()
export default class SNS {
  public async publishMessage(region: string, inputParams: AWS.SNS.PublishInput): Promise<AWS.SNS.PublishResponse> {
    const sns: AWS.SNS = new AWS.SNS({ region });
    return await sns.publish(inputParams).promise();
  }
}
