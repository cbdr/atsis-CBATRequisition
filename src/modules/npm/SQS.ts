import * as AWS from 'aws-sdk';
import { injectable } from 'inversify';

@injectable()
export default class SQS {
  public async receiveMessage(region: string, queueParams: AWS.SQS.ReceiveMessageRequest): Promise<AWS.SQS.ReceiveMessageResult> {
      const sqs: AWS.SQS = new AWS.SQS({region});
      return sqs.receiveMessage(queueParams).promise();
  }

  public async deleteMessage(region: string, queueUrl: string, receiptHandle: string): Promise<any> {
    const queueParams: AWS.SQS.DeleteMessageRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    };
    const sqs: AWS.SQS = new AWS.SQS({region});
    return sqs.deleteMessage(queueParams).promise();
  }

  public async putMessage(region: string, queueUrl: string, message: string): Promise<any> {
    const queueParams: AWS.SQS.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: message
    };
    const sqs: AWS.SQS = new AWS.SQS({region});
    return sqs.sendMessage(queueParams).promise();
  }
}
