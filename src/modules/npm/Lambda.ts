import { injectable } from 'inversify';
import * as AWS from 'aws-sdk';

@injectable()
export default class Lambda {

  public async invoke(name: string, region: string, payload: string): Promise<AWS.Lambda.InvocationResponse> {
      const lambda: AWS.Lambda = new AWS.Lambda({region});
      const response: AWS.Lambda.InvocationResponse = await lambda.invoke({
        FunctionName: name,
        InvocationType : 'RequestResponse',
        LogType : 'None',
        Payload: payload
      }).promise();
      return response;
  }
}
