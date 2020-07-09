import IConfiguration from './IConfiguration';
import { injectable } from 'inversify';
import Process from '../../npm/Process';

@injectable()
export default class ConfigurationLoader {
  public constructor(
    private process: Process
  ) {}

  public getConfiguration(): any {
     return {
       region: this.process.getEnvVar('REGION'),
       logLevel: this.process.getEnvVar('LOG_LEVEL') || 'info',
       stage: this.process.getEnvVar('STAGE'),
       accountNumber: this.process.getEnvVar('ACCOUNT_NUMBER'),
       clientId: this.process.getEnvVar('CLIENT_ID'),
       sharedSecret: this.process.getEnvVar('SHARED_SECRET'),
       scalyrURL: this.process.getEnvVar('SCALYR_URL'),
       scalyrLog: this.process.getEnvVar('SCALYR_LOG'),
       scalyrToken: this.process.getEnvVar('SCALYR_TOKEN'),
       scalyrTimeout: this.process.getEnvVar('SCALYR_TIMEOUT') || '3000',
       loggerName: this.process.getEnvVar('LOGGER_NAME'),
     };
  }

  // TODO: delete this in favour of EC2 parameter store
  public getConfigurationEnvVars(): any {
    return [
      {name: 'REGION', value: this.process.getEnvVar('REGION')},
      {name: 'LOG_LEVEL', value: this.process.getEnvVar('LOG_LEVEL') || 'info'},
      {name: 'CB_API_ROOT', value: this.process.getEnvVar('CB_API_ROOT')},
      {name: 'CB_API_ROOT_READONLY', value: this.process.getEnvVar('CB_API_ROOT_READONLY')},
      {name: 'STAGE', value: this.process.getEnvVar('STAGE')},
      {name: 'ACCOUNT_NUMBER', value: this.process.getEnvVar('ACCOUNT_NUMBER')},
      {name: 'BATCH_QUEUE_STAGE', value: this.process.getEnvVar('BATCH_QUEUE_STAGE') || 'stage'},
      {name: 'CLIENT_ID', value: this.process.getEnvVar('CLIENT_ID')},
      {name: 'SHARED_SECRET', value: this.process.getEnvVar('SHARED_SECRET')},
      {name: 'CLIENT_ID_READONLY', value: this.process.getEnvVar('CLIENT_ID_READONLY')},
      {name: 'SHARED_SECRET_READONLY', value: this.process.getEnvVar('SHARED_SECRET_READONLY')},
      {name: 'CERT_PWD', value: this.process.getEnvVar('CERT_PWD')},
      {name: 'SCALYR_URL', value: this.process.getEnvVar('SCALYR_URL')},
      {name: 'SCALYR_LOG', value: this.process.getEnvVar('SCALYR_LOG')},
      {name: 'SCALYR_TOKEN', value: this.process.getEnvVar('SCALYR_TOKEN')},
      {name: 'SCALYR_TIMEOUT', value: this.process.getEnvVar('SCALYR_TIMEOUT') || '3000'},
      {name: 'LOGGER_NAME', value: this.process.getEnvVar('LOGGER_NAME')},
      {name: 'CB_APPLY_BASE_URL', value: this.process.getEnvVar('CB_APPLY_BASE_URL')}
    ];
  }
}
