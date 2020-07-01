import { injectable } from 'inversify';
import DateUtils from '../utils/DateUtils';

@injectable()
export default class Timer {
    public constructor(
      private dateUtils: DateUtils
    ) {
    }

    public async apply(fn: () => Promise<void>): Promise<number> {
       const startTime: number = this.dateUtils.currentTime();
       await fn();
       const endTime: number = this.dateUtils.currentTime();
       return (endTime - startTime) / 1000;
    }
}
