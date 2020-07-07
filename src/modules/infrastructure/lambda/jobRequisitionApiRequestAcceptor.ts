import 'reflect-metadata';
import { Context, Callback } from 'aws-lambda';
import * as _ from 'lodash';
import SNS from '../../npm/SNS'
import NpmModule from '../../npm/NpmModule';
import CoreModule from '../../core/CoreModule';


import IntegrationModule from '../../integration/IntegrationModule';
import InfrastructureModule from '../InfrastructureModule';
import { Container } from 'inversify';
import Logger from '../../core/logging/Logger';

export async function handler(event: any, context: any, callback: any): Promise<void> {
  const container: Container = new Container();
  container.load(NpmModule, CoreModule, IntegrationModule, InfrastructureModule);
  container.bind<any>('initialContext').toConstantValue({});
  container.bind<string>('fileName').toConstantValue(__filename);
  container.bind<Container>(Container).toConstantValue(container);

  const logger: Logger = container.get<Logger>(Logger);
  try {
      const snsClient = container.get<SNS>(SNS);
      const message: any = JSON.parse(event.body);
    await snsClient.publishMessage(
      'us-east-1',
      {Message:message,
        TopicArn:'arn:aws:sns:us-east-1:160387761777:job-requisition-request-distribution-stage'
      }
      
      );
    const response: any = {
        statusCode: 200,
        body: JSON.stringify({
            'message':'your request has been accepted and response will be emailed '
        })
    };
    return response;
  } catch (error) {
    logger.error('A critical error occurred', { error });
    callback(error, null);
  }
  callback(null, 'OK');
}