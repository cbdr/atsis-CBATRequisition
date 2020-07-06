import { inject } from 'inversify';
import { injectable } from 'inversify';
import * as _ from 'lodash';
import * as bunyan from 'bunyan';
import * as path from 'path';
import ConfigurationLoader from '../configuration/ConfigurationLoader';
import IConfiguration from '../configuration/IConfiguration';
import UUID from '../../npm/UUID';
import LoggerFactory from './LoggerFactory';
import { IPersistentLogger } from './persistent/IPersistentLogger';
import { isNullOrUndefined } from 'util';

type LogType = bunyan.LogLevel;

@injectable()
export default class Logger {
  private context: any;
  private bunyanLogger: bunyan;

  public constructor(
    @inject('initialContext')initialContext: any,
    @inject('fileName')fileName: string,
    private configLoader: ConfigurationLoader,
    private uuid: UUID,
    private loggerFactory: LoggerFactory
  ) {
    const config: IConfiguration = configLoader.getConfiguration();
    this.bunyanLogger = bunyan.createLogger({ name: 'ATSIS-Candidate-Pull', file: fileName, level: config.logLevel as LogType });
    this.context = initialContext;
    this.addPersistentLogger(config);
  }

  public trace(msg: string, localContext: object): void {
    this.logAction('trace', localContext, msg);
  }

  public debug(msg: string, localContext: object): void {
    this.logAction('debug', localContext, msg);
  }

  public info(msg: string, localContext: object): void {
    //console.log('inside logger and messahe is',msg, 'and local context is', localContext);
    this.logAction('info', localContext, msg);
  }

  public warn(msg: string, localContext: object): void {
    this.logAction('warn', localContext, msg);
  }

  public error(msg: string, localContext: object): void {
    this.logAction('error', localContext, msg);
  }

  public exception(exception: Error, localContext: object): void {
    localContext = localContext || {};
    this.addLocalContext(localContext);
    this.bunyanLogger.error(exception, 'An error has occurred! ', localContext);
  }

  public addContext(newContext: object): void {
     this.addLocalContext(newContext);
     this.context = newContext;
  }

  public addIdentifier(idName: string): void {
    this.addContext({
      [idName] : this.uuid.generateUUID()
    });
  }

  public getContextField(idName: string): any {
    return this.context[idName];
  }

  public enterNewFile(fileName: string): Logger {
    const newLogger: Logger = new Logger(this.context, path.basename(fileName), this.configLoader, this.uuid, this.loggerFactory);
    return newLogger;
  }

  private logAction(functionName: LogType, logContext: object, msg: string): void {
    const localContext: any = {};
    _.merge(localContext, logContext);
    //console.log('local context is', localContext);
    this.addLocalContext(localContext);
    this.bunyanLogger[functionName](localContext, msg);
  }

  private addLocalContext(argumentsCopy: object): void {
    _.merge(argumentsCopy, this.context);
    //console.log('argument copy is',argumentsCopy, this.context)
  }

  private addPersistentLogger(config: IConfiguration): void {
    const persistentLogger: IPersistentLogger = this.loggerFactory.createPersistentLogger(config.loggerName);
    if (isNullOrUndefined(persistentLogger)) {
      return;
    }

    this.bunyanLogger.addStream({
      type: 'raw',
      stream: persistentLogger as bunyan.Stream,
      closeOnExit: true,
      level: config.logLevel as LogType
    });
  }
}
