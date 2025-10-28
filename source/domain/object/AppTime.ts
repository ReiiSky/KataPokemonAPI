import { Option } from 'package/Option';
import { InvalidParam } from 'package/error';

export class AppTime {
  public static readonly JakartaOffset = 7;
  private static msPerDay = 24 * 60 * 60 * 1000;

  constructor(private readonly t: Date) {}

  public static now() {
    return new AppTime(new Date());
  }

  public addD(d: number) {
    if (Number.isNaN(d)) {
      throw new InvalidParam('d', Option.some(AppTime.name));
    }

    const newDate = new Date(this.t);
    newDate.setUTCDate(newDate.getUTCDate() + d);

    return new AppTime(newDate);
  }

  public addH(h: number) {
    if (Number.isNaN(h)) {
      throw new InvalidParam('h', Option.some(AppTime.name));
    }

    const newDate = new Date(this.t);
    newDate.setUTCHours(newDate.getUTCHours() + h);

    return new AppTime(newDate);
  }

  public minuteDiff(other: AppTime) {
    return Math.floor(this.secondDiff(other) / 60);
  }

  private secondDiff(other: AppTime) {
    return this.millisDiff(other) / 1000;
  }

  public millisDiff(other: AppTime) {
    const currentUnix = this.t.getTime();
    const otherUnix = other.t.getTime();

    return currentUnix - otherUnix;
  }

  public moreThan(other: AppTime) {
    return this.secondDiff(other) > 0;
  }

  public lessThan(other: AppTime) {
    return this.secondDiff(other) < 0;
  }

  public addS(s: number) {
    if (Number.isNaN(s)) {
      throw new InvalidParam('s', Option.some(AppTime.name));
    }

    const newDate = new Date(this.t);
    newDate.setUTCSeconds(newDate.getUTCSeconds() + s);

    return new AppTime(newDate);
  }

  public addM(months: number) {
    if (Number.isNaN(months)) {
      throw new InvalidParam('months', Option.some(AppTime.name));
    }

    const newDate = new Date(this.t);
    newDate.setUTCMonth(newDate.getUTCMonth() + months);

    return new AppTime(newDate);
  }

  public addY(years: number) {
    if (Number.isNaN(years)) {
      throw new InvalidParam('years', Option.some(AppTime.name));
    }

    const newDate = new Date(this.t);
    newDate.setUTCFullYear(newDate.getUTCFullYear() + years);

    return new AppTime(newDate);
  }

  public addm(minutes: number) {
    if (Number.isNaN(minutes)) {
      throw new InvalidParam('minutes', Option.some(AppTime.name));
    }

    const newDate = new Date(this.t);
    newDate.setUTCMinutes(newDate.getUTCMinutes() + minutes);

    return new AppTime(newDate);
  }

  public dateDiff(other: AppTime): number {
    if (this.lessThan(other)) {
      return Math.ceil(
        (other.t.getTime() - this.t.getTime()) / AppTime.msPerDay
      );
    }

    return Math.ceil((this.t.getTime() - other.t.getTime()) / AppTime.msPerDay);
  }

  public get iso() {
    return this.t.toISOString();
  }

  public get unix() {
    return this.t.getTime();
  }

  public get date() {
    return new Date(this.t);
  }

  public get Y() {
    return this.t.getUTCFullYear();
  }

  public get M() {
    return this.t.getUTCMonth() + 1;
  }

  public get D() {
    return this.t.getUTCDate();
  }

  public get h() {
    return this.t.getUTCHours();
  }

  public get m() {
    return this.t.getUTCMinutes();
  }

  public get s() {
    return this.t.getUTCSeconds();
  }
}
