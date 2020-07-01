import * as _ from 'lodash';
import { injectable } from 'inversify';
import FatalWorkerError from '../common/errors/FatalWorkerError';
import RateLimitExceededError from '../common/errors/RateLimitExceededError';

interface IWorker {
  id?: string;
  params?: any;
  fn(params: any): Promise<any>;
}

interface IWorkerExecution {
  worker: IWorker;
  promise: Promise<any>;
}

type WorkerFunction = (params: any) => Promise<any>;

@injectable()
export class AsyncPool {
  private readyQueue: IWorker [];
  private processQueue: IWorkerExecution [];
  private currentId: number;
  private maxConcurrency: number;
  private executionCount: number;

  public constructor() {
    this.readyQueue = [];
    this.processQueue = [];
    this.currentId = 1;
    this.maxConcurrency = 5;
    this.executionCount = 0;
  }

  public setMaxConcurrency(maxConcurrency: number): void {
    this.maxConcurrency = maxConcurrency;
  }

  public startWorker(worker: IWorker): void {
    try {
      worker.id = `Worker${this.currentId++}`;
      if (this.executionCount < this.maxConcurrency) {
        this.executionCount++;
        const promise: Promise<any> = this.invokeWorker(worker);
        this.processQueue.push({
          worker,
          promise
        });
      } else {
        this.readyQueue.push(worker);
      }
    } catch (err) {
      throw err;
    }
  }

  public startFn(fn: WorkerFunction): void {
      this.startWorker({
        fn
      });
  }

  public async  waitForAll(): Promise<void> {
    while (this.readyQueue.length > 0 || this.executionCount > 0) {
      await Promise.all(this.processQueue.map(async (x: IWorkerExecution) => x.promise));
    }
  }

  private async invokeWorker( worker: IWorker): Promise<void> {
    try {
      await  worker.fn(worker.params);
    } catch (err) {
      if (err instanceof FatalWorkerError) {
        throw err;
      }
    }
    this.executionCount--;
    _.remove(this.processQueue, (x: IWorkerExecution) => x.worker.id === worker.id);
    this.invokeNextReady();
  }

  private async invokeNextReady(): Promise<any> {
    try {
      if (this.executionCount < this.maxConcurrency) {
        if (this.readyQueue.length === 0) {
          return;
        }
        const worker: IWorker = this.readyQueue.shift();
        this.startWorker(worker);
      } else {
        throw new Error('Critical error in pool - executionCount >= maxConcurrency');
      }
    } catch (err) {
      throw err;
    }
  }
}
