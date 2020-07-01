import { injectable, Container } from 'inversify';
import { AsyncPool } from './AsyncPool';

@injectable()
export default class AsyncPoolFactory {
  private constructor(private container: Container) {
  }

  public createPool(maxConcurrency: number): AsyncPool {
    const newPool: AsyncPool = this.container.get<AsyncPool>(AsyncPool);
    newPool.setMaxConcurrency(maxConcurrency);
    return newPool;
  }
}
