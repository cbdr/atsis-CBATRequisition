import 'reflect-metadata';
import { Context, Callback } from 'aws-lambda';
import * as _ from 'lodash';
import batchCreator from '../batchCreator/batchCreator';
import NpmModule from '../../npm/NpmModule';
import CoreModule from '../../core/coreModule';
import SNS from '../../npm/SNS'


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
      const message: any = snsClient.getMessage(event);
      let searchParams = ''
      if(message.title){
        searchParams =searchParams+`Prop38:${message.title};`;
      }
    const batchCreatorFunc: batchCreator = container.get<batchCreator>(batchCreator);
    const batchName: string= 'job-requisition-batch';
    await batchCreatorFunc.executeJobDefinition(
      message,
      batchName
      );
  } catch (error) {
    logger.error('A critical error occurred', { error });
    callback(error, null);
  }
  callback(null, 'OK');
}