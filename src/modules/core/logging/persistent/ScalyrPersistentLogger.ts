import { injectable } from 'inversify';
import * as _ from 'lodash';
import * as request from 'request-promise';
import ConfigurationLoader from '../../configuration/ConfigurationLoader';
import IConfiguration from '../../configuration/IConfiguration';
import { IPersistentLogger } from './IPersistentLogger';
import ObjectUtils from '../../utils/ObjectUtils';
import Process from '../../../npm/Process';

@injectable()
export default class ScalyrPersistentLogger implements IPersistentLogger {
  private static FORBIDDEN_FIELDS: string[] = ['apikey', 'candidatestreamsecretkey', 'clientsecret', 'credential', 'credentials', 'password',
                                               'secret', 'secretkey', 'user', 'userid', 'username', 'token', 'document', 'base64_resume'];
  private loggerOptions: any;
  public constructor(configLoader: ConfigurationLoader,
                     private objUtils: ObjectUtils,
                     private process: Process) {
    const config: IConfiguration = configLoader.getConfiguration();
    const environment: string = config.stage.toLowerCase() === 'stage' ? 'test' : 'prod';

    this.loggerOptions = {
      method: 'POST',
      uri: `${ config.scalyrURL }?token=`,
      qs: {
        logfile: `${ config.scalyrLog }-${ environment }`,
        server: `${ config.scalyrLog }-${ environment }`,
        parser: config.scalyrLog,
        token: config.scalyrToken
      },
      timeout: Number(config.scalyrTimeout)
    };
  }

  public async write(context: any): Promise<void> {
    try {
      this.updateScalyrCalls(1);
      this.loggerOptions.body = JSON.stringify(this.objUtils.redact(context, ScalyrPersistentLogger.FORBIDDEN_FIELDS));
      await request(this.loggerOptions);
      this.updateScalyrCalls(-1);
    } catch {
      this.updateScalyrCalls(-1);
    }
  }

  private updateScalyrCalls(value: number): void {
    const scalyrCalls: number = Number(this.process.getEnvVar('ScalyrCalls') || '0') + value;
    this.process.setEnvVar('ScalyrCalls', scalyrCalls.toString());
  }
}
