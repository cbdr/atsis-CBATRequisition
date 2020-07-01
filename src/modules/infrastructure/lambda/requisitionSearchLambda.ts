import 'reflect-metadata';
import { Callback, Context } from 'aws-lambda';
import * as _ from 'lodash';
import * as dotEnv from 'dotenv';
import { Container } from 'inversify';
import Logger from '../../core/logging/Logger';
import { ILambdaApiRequest, ILambdaApiResponse } from './models/lambdaApiModel'

dotEnv.config();

export async function handler(event: ILambdaApiRequest, context: any, callback: any): Promise<void> {
  const container: Container = new Container();
  container.load( );
  container.bind<any>('initialContext').toConstantValue({});
  container.bind<string>('fileName').toConstantValue(__filename);
  container.bind<Container>(Container).toConstantValue(container);

  const logger: Logger = container.get<Logger>(Logger);
  
  let params = {

  }  ;
  
  //let response: ILambdaApiResponse = null;

  try {

  } catch (err) {
    //response = responseUtils.getErrorResponse(err);
  }
  callback(null,'response');
}