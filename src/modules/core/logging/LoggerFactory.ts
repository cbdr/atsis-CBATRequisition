import { injectable, Container } from 'inversify';
import { IPersistentLogger } from './persistent/IPersistentLogger';
import ScalyrPersistentLogger from './persistent/ScalyrPersistentLogger';

@injectable()
export default class LoggerFactory {
  private static LOGGER_SCALYR: string = 'scalyr';

  public constructor(private container: Container) { }

  public createPersistentLogger(loggerName: string): IPersistentLogger {
    switch (loggerName) {
      case LoggerFactory.LOGGER_SCALYR: {
        return this.container.get<ScalyrPersistentLogger>(ScalyrPersistentLogger);
      }
    }

    return null;
  }
}
