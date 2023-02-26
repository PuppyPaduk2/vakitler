import { DateTime, Interval } from "luxon";
import { AllTimes, DayTimes, TimeNames } from "@/lib/types";
import { secondSplit } from "@/lib/utils";

export class Time {
  public [TimeNames.Fajr]: string;
  public [TimeNames.Sunrise]: string;
  public [TimeNames.Dhuhr]: string;
  public [TimeNames.Asr]: string;
  public [TimeNames.Maghrib]: string;
  public [TimeNames.Isha]: string;

  constructor(times: DayTimes) {
    this[TimeNames.Fajr] = times[0];
    this[TimeNames.Sunrise] = times[1];
    this[TimeNames.Dhuhr] = times[2];
    this[TimeNames.Asr] = times[3];
    this[TimeNames.Maghrib] = times[4];
    this[TimeNames.Isha] = times[5];
  }
}

export class Times {
  public times: {
    [key: string]: Time;
  };

  constructor(times: AllTimes) {
    this.times = {};
    Object.keys(times).map((day) => {
      this.add(day, times[day]);
    });
  }

  public add(date: string, times: DayTimes) {
    const time = new Time(times);
    this.times[date] = time;
  }

  get today() {
    const date = DateTime.local().toISODate();
    return this.times[date];
  }

  // get tomorrow() {
  //   const date = DateTime.local().plus({ days: 1 }).toISODate();
  //   return this.times[date];
  // }

  get time(): { now: TimeNames; next: TimeNames } {
    const datetime = DateTime.local();
    const hourFormat = "HH:mm";

    const fajr = DateTime.fromFormat(this.today[TimeNames.Fajr], hourFormat);
    const sun = DateTime.fromFormat(this.today[TimeNames.Sunrise], hourFormat);
    const dhuhr = DateTime.fromFormat(this.today[TimeNames.Dhuhr], hourFormat);
    const asr = DateTime.fromFormat(this.today[TimeNames.Asr], hourFormat);
    const maghrib = DateTime.fromFormat(
      this.today[TimeNames.Maghrib],
      hourFormat
    );
    const isha = DateTime.fromFormat(this.today[TimeNames.Isha], hourFormat);
    // const tomorrowFajr = DateTime.fromFormat(
    //   this.tomorrow[TimeNames.Fajr],
    //   hourFormat
    // );

    // default values = Isha
    const obj: { now: TimeNames; next: TimeNames } = {
      now: TimeNames.Isha,
      next: TimeNames.Fajr,
    };

    if (Interval.fromDateTimes(fajr, sun).contains(datetime)) {
      obj.now = TimeNames.Fajr;
      obj.next = TimeNames.Sunrise;
    } //
    else if (Interval.fromDateTimes(sun, dhuhr).contains(datetime)) {
      obj.now = TimeNames.Sunrise;
      obj.next = TimeNames.Dhuhr;
    } //
    else if (Interval.fromDateTimes(dhuhr, asr).contains(datetime)) {
      obj.now = TimeNames.Dhuhr;
      obj.next = TimeNames.Asr;
    } //
    else if (Interval.fromDateTimes(asr, maghrib).contains(datetime)) {
      obj.now = TimeNames.Asr;
      obj.next = TimeNames.Maghrib;
    } //
    else if (Interval.fromDateTimes(maghrib, isha).contains(datetime)) {
      obj.now = TimeNames.Maghrib;
      obj.next = TimeNames.Isha;
    }

    return obj;
  }

  get timer(): [string, string, string] {
    const milisecond = DateTime.fromFormat(this.today[this.time.next], "HH:mm")
      .diff(DateTime.now())
      .toMillis();

    return secondSplit(milisecond / 1000);
  }
}
