import { injectable } from 'inversify';
import * as AWS from 'aws-sdk';

export declare type IDynamoQuery = AWS.DynamoDB.DocumentClient.QueryInput;
export declare type IDynamoPut = AWS.DynamoDB.DocumentClient.PutItemInput;
export declare type IDynamoOutput = AWS.DynamoDB.PutItemOutput;
export declare type IQueryOutput = AWS.DynamoDB.QueryOutput;
export declare type IDocumentClient = AWS.DynamoDB.DocumentClient;

@injectable()
export default class DynamoClient {
  public async query(region: string, queryInput: IDynamoQuery): Promise<any> {
    const client: IDocumentClient = new AWS.DynamoDB.DocumentClient({ region });
    const response: IQueryOutput = await client.query(queryInput).promise();

    return response ;
  }

  public async put(region: string, putInput: IDynamoPut): Promise<IDynamoOutput> {
    const client: IDocumentClient = new AWS.DynamoDB.DocumentClient({ region });
    const response: IDynamoOutput = await client.put(putInput).promise();

    return response;
  }
}
