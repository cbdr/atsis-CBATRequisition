import { AsyncPool } from './AsyncPool';
import { injectable } from 'inversify';
import AsyncPoolFactory from './AsyncPoolFactory';

interface ITask {
  fn(params: any): Promise<any>;
}

@injectable()
export default class BackgroundTaskManager {
  private fifoPool: AsyncPool;

  public constructor(asyncPoolFactory: AsyncPoolFactory) {
    this.fifoPool = asyncPoolFactory.createPool(1);
  }

  public addFifoTask(taskFunction: ITask): void {
    this.fifoPool.startWorker(taskFunction);
  }

  public async waitForAllTasks(): Promise<void> {
    await this.fifoPool.waitForAll();
  }
}
