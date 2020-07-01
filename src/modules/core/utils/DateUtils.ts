import * as moment from 'moment';
import { injectable } from 'inversify';
import ObjectUtils from './ObjectUtils';
import { isNullOrUndefined } from 'util';

type DateUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';

export type UTCOffSet = 'UTC-12' | 'UTC-11' | 'UTC-10' | 'UTC-9' | 'UTC-8' | 'UTC-7' |
                        'UTC-6'  | 'UTC-5'  | 'UTC-4'  | 'UTC-3' | 'UTC-2' | 'UTC-1' | 'UTC-3:30' | 'UTC-5:30' |
                        'UTC+0'  |
                        'UTC+1'  | 'UTC+2'  | 'UTC+3'  | 'UTC+4'  | 'UTC+5'  | 'UTC+6'  |
                        'UTC+7'  | 'UTC+8'  | 'UTC+9'  | 'UTC+10' | 'UTC+11' | 'UTC+12' | 'UTC+3:30';

interface ITimeZone {
  timeZone: string;
  utcOffSet: UTCOffSet;
}

@injectable()
export default class DateUtils {
  public constructor(
    private objUtils: ObjectUtils
  ) {
  }

  public now(): string {
      return moment.utc().toISOString();
  }

  public daysFromNow(days: number): string {
    return moment.utc().add(days, 'days').toISOString();
}

  public currentTime(incrementInSeconds: number = 0): number {
    return moment.utc().add(incrementInSeconds , 'seconds').toDate().getTime();
  }

  public format(dateStr: string , fmtString: string): string {
     if (!this.objUtils.isNull(dateStr) && !this.objUtils.isNull(fmtString)) {
       return moment.utc(dateStr).format(fmtString);
     }
     return null;
  }

  public parse(dateString: string, fmtString?: string ): string {
    let parsedDate: moment.Moment;
    if (!this.objUtils.isNull(fmtString)) {
       parsedDate = moment.utc(dateString, [fmtString], true);
    } else {
       parsedDate = moment.utc(dateString);
    }
    if (parsedDate.isValid()) {
      return parsedDate.toISOString();
    }
    throw new Error(`Can't parse date ${dateString} with format ${fmtString}`);
  }

  public parseTimestamp(timestamp: number): string {
    const parsedDate: moment.Moment = moment.utc(timestamp);
    if (parsedDate.isValid()) {
      return parsedDate.toISOString();
    }
    throw new Error(`Can't parse timestamp ${timestamp}`);
  }

  public isTimestampLessThanCurrentDate(timestamp: number, thresholdInSeconds: number = 0): boolean {
    const dateToCompare: any = moment.utc(timestamp);
    const currentDate: any = moment.utc(this.currentTime());
    return dateToCompare.diff(currentDate, 'seconds') <= thresholdInSeconds;
  }

  public getEpoch(): number {
    return Date.now() / 1000;
  }

  public dateDiff(dateA: string, dateB: string, unit: DateUnit): number {
    const utcDateA: any = moment.utc(dateA);
    const utcDateB: any = moment.utc(dateB);
    return utcDateA.diff(utcDateB, unit);
  }

  public addTime(date: string, period: number, unit: DateUnit): string {
    return moment.utc(date).add(period, unit).toISOString();
  }

  public getUtcOffSet(date: string): number {
    return moment.parseZone(date).utcOffset() / 60;
  }

  public addUtcOffSet(date: string, utcOffSet: number, keepLocalTime: boolean = false): string {
    return moment.utc(date, 'YYYY-MM-DD[T]HH:mm:ss').utcOffset(utcOffSet, keepLocalTime).format();
  }

  public fromTimeZoneToUTCOffSet(date: string, keepLocalTime: boolean = false): string {
    const timeZone: ITimeZone = this.getTimeZoneList().find((tz: ITimeZone) => date.endsWith(tz.timeZone));
    if (!isNullOrUndefined(timeZone)) {
      const utcOffSet: number = Number(timeZone.utcOffSet.replace('UTC', ''));
      return this.addUtcOffSet(date, utcOffSet, keepLocalTime);
    }
    return date;
  }

  private getTimeZoneList(): ITimeZone[] {
    return [
      { timeZone: 'HST', utcOffSet: 'UTC-10' },
      { timeZone: 'AKST', utcOffSet: 'UTC-9' },
      { timeZone: 'PST', utcOffSet: 'UTC-8' },
      { timeZone: 'MST', utcOffSet: 'UTC-7' },
      { timeZone: 'CST', utcOffSet: 'UTC-6' },
      { timeZone: 'EST', utcOffSet: 'UTC-5' },
      { timeZone: 'PT', utcOffSet: 'UTC-8' },
      { timeZone: 'MT', utcOffSet: 'UTC-7' },
      { timeZone: 'CT', utcOffSet: 'UTC-6' },
      { timeZone: 'ET', utcOffSet: 'UTC-5' },
      { timeZone: 'AKDT', utcOffSet: 'UTC-8' },
      { timeZone: 'PDT', utcOffSet: 'UTC-7' },
      { timeZone: 'MDT', utcOffSet: 'UTC-6' },
      { timeZone: 'CDT', utcOffSet: 'UTC-5' },
      { timeZone: 'EDT', utcOffSet: 'UTC-4' },
      { timeZone: 'UTC', utcOffSet: 'UTC+0' },
      { timeZone: 'GMT', utcOffSet: 'UTC+0' }
    ];
  }
}
