import 'reflect-metadata';
import * as _ from 'lodash';
import * as dotEnv from 'dotenv';
import { injectable } from 'inversify';
import Logger from '../../core/logging/Logger';
import IConfiguration from '../../core/configuration/IConfiguration';
import ConfigurationLoader from '../../core/configuration/ConfigurationLoader';

import requisitionBatchManager from '../batch/requisitionBatchManager';
import { isNullOrUndefined } from 'util';
dotEnv.config();

@injectable()
export default class Scheduler {
  public constructor(private configLoader: ConfigurationLoader, private logger: Logger, private batchManager: requisitionBatchManager) { }
  
  public async executeJobDefinition(jobDefinition: string, batchName: string): Promise<void> {
      try {
        const configuration: IConfiguration = this.configLoader.getConfiguration();
        jobDefinition = `${jobDefinition}-${configuration.stage}`;
        const jobQueue: string = `atsis-update-queue-${configuration.stage}`;
        await this.batchManager.submitConfigurations({
          jobDefinition,
          jobQueue,
          region: configuration.region,
          batchName,
        });
      } catch (err) {
        this.logger.debug('Job definition execution failed', { err });
        throw err;
      }
  }
}
