import { ContainerModule , interfaces } from 'inversify';
import Logger from './logging/Logger';
import { AsyncPool } from './async/AsyncPool';
import { RequestLogger } from './http/RequestLogger';
import ObjectUtils from './utils/ObjectUtils';
import AsyncPoolFactory from './async/AsyncPoolFactory';
import DateUtils from './utils/DateUtils';
import XMLUtils from './utils/XMLUtils';
import Timer from './time/Timer';
import { RequestRetry } from './http/RequestRetry';
import ErrorParser from './common/errors/ErrorParser';
import ScalyrPersistentLogger from './logging/persistent/ScalyrPersistentLogger';
import LoggerFactory from './logging/LoggerFactory';
import BackgroundWorkerManager from './async/BackgroundTaskManager';
import FileUtils from './utils/FileUtils';
import configurationLoader from './configuration/ConfigurationLoader'
import configurationValidator from './configuration/ConfigurationValidator'


const CoreModule: ContainerModule = new ContainerModule(
  (
      bind: interfaces.Bind
  ): any => {
     bind<Logger>(Logger).toSelf().inSingletonScope();
     bind<AsyncPool>(AsyncPool).toSelf();
     bind<AsyncPoolFactory>(AsyncPoolFactory).toSelf();
     bind<RequestLogger>(RequestLogger).toSelf();
     bind<RequestRetry>(RequestRetry).toSelf();
     bind<ObjectUtils>(ObjectUtils).toSelf();
     bind<DateUtils>(DateUtils).toSelf();
     bind<XMLUtils>(XMLUtils).toSelf();
     bind<Timer>(Timer).toSelf();
     bind<ErrorParser>(ErrorParser).toSelf();
     bind<ScalyrPersistentLogger>(ScalyrPersistentLogger).toSelf();
     bind<LoggerFactory>(LoggerFactory).toSelf();
     bind<BackgroundWorkerManager>(BackgroundWorkerManager).toSelf().inSingletonScope();
     bind<FileUtils>(FileUtils).toSelf();
     bind<configurationLoader>(configurationLoader).toSelf();
     bind<configurationValidator>(configurationValidator).toSelf();
  }
);

export  default CoreModule;
