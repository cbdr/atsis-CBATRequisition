import { injectable } from 'inversify';
import * as cluster from 'cluster';

type ExitEvent = (workerPid: number, code: number, signal: string) => void;

@injectable()
export default class Cluster {
  public createWorker(): void {
    cluster.fork();
  }

  public onWorkerExit(handler: ExitEvent): void {
    cluster.on('exit', (worker: cluster.Worker, code: number, signal: string) => {
      handler(worker.process.pid, code, signal);
    });
  }
}
