import { injectable } from 'inversify';
import { isNullOrUndefined } from 'util';
import ConfigurationError from '../common/errors/ConfigurationError';

@injectable()
export default class ConfigurationValidator {
  private static LEGACY_PLATFORM: string = 'MATRIX';
  private static NEW_PLATFORM: string = 'AWS';

  public constructor() { }

  public isConfigurationActiveForNewPlatform(atsSyncConfig: any): boolean {
    const platform: string = atsSyncConfig.pullConfiguration.platform || ConfigurationValidator.NEW_PLATFORM;
    switch (platform) {
      case ConfigurationValidator.NEW_PLATFORM:
        return true;
      case ConfigurationValidator.LEGACY_PLATFORM:
        return false;
      default:
        return false;
    }
  }
}
