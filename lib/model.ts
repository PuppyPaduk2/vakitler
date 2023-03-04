import { DateTime, Interval } from "luxon";
import { ITime, TimeNames, TypeTimer } from "@/lib/types";
import { secondSplit } from "@/lib/utils";
import { hourFormat } from "@/lib/const";

export class Time {
  public [TimeNames.Imsak]: string;
  public [TimeNames.Gunes]: string;
  public [TimeNames.Ogle]: string;
  public [TimeNames.Ikindi]: string;
  public [TimeNames.Aksam]: string;
  public [TimeNames.Yatsi]: string;
  public MiladiTarihUzunIso8601: string;
  public MiladiTarihKisa: string;
  public HicriTarihUzun: string;
  public KibleSaati: string;

  constructor(props: ITime) {
    this[TimeNames.Imsak] = props[TimeNames.Imsak];
    this[TimeNames.Gunes] = props[TimeNames.Gunes];
    this[TimeNames.Ogle] = props[TimeNames.Ogle];
    this[TimeNames.Ikindi] = props[TimeNames.Ikindi];
    this[TimeNames.Aksam] = props[TimeNames.Aksam];
    this[TimeNames.Yatsi] = props[TimeNames.Yatsi];
    this.MiladiTarihUzunIso8601 = props.MiladiTarihUzunIso8601;
    this.MiladiTarihKisa = props.MiladiTarihKisa;
    this.HicriTarihUzun = props.HicriTarihUzun;
    this.KibleSaati = props.KibleSaati;
  }
}

export class Times {
  public times: Time[];

  constructor(data: ITime[] = []) {
    this.times = data.map((day) => new Time(day));
  }

  get hasData(): boolean {
    return this.times.length > 0;
  }

  get today(): Time {
    return this.times.find((day) => {
      const today = DateTime.local().toFormat("dd.MM.yyyy");
      return day.MiladiTarihKisa === today;
    }) as Time;
  }

  get tomorrow(): Time {
    return this.times.find((day) => {
      const today = DateTime.local().plus({ days: 1 }).toFormat("dd.MM.yyyy");
      return day.MiladiTarihKisa === today;
    }) as Time;
  }

  get time(): { now: TimeNames; next: TimeNames } {
    const Imsak = DateTime.fromFormat(this.today[TimeNames.Imsak], hourFormat);
    const Gunes = DateTime.fromFormat(this.today[TimeNames.Gunes], hourFormat);
    const Ogle = DateTime.fromFormat(this.today[TimeNames.Ogle], hourFormat);
    const Ikindi = DateTime.fromFormat(
      this.today[TimeNames.Ikindi],
      hourFormat
    );
    const Aksam = DateTime.fromFormat(this.today[TimeNames.Aksam], hourFormat);
    const Yatsi = DateTime.fromFormat(this.today[TimeNames.Yatsi], hourFormat);

    // default values = Isha
    const obj: { now: TimeNames; next: TimeNames } = {
      now: TimeNames.Yatsi,
      next: TimeNames.Imsak,
    };

    const datetime = DateTime.local();

    if (Interval.fromDateTimes(Imsak, Gunes).contains(datetime)) {
      obj.now = TimeNames.Imsak;
      obj.next = TimeNames.Gunes;
    } //
    else if (Interval.fromDateTimes(Gunes, Ogle).contains(datetime)) {
      obj.now = TimeNames.Gunes;
      obj.next = TimeNames.Ogle;
    } //
    else if (Interval.fromDateTimes(Ogle, Ikindi).contains(datetime)) {
      obj.now = TimeNames.Ogle;
      obj.next = TimeNames.Ikindi;
    } //
    else if (Interval.fromDateTimes(Ikindi, Aksam).contains(datetime)) {
      obj.now = TimeNames.Ikindi;
      obj.next = TimeNames.Aksam;
    } //
    else if (Interval.fromDateTimes(Aksam, Yatsi).contains(datetime)) {
      obj.now = TimeNames.Aksam;
      obj.next = TimeNames.Yatsi;
    }

    return obj;
  }

  get timer(): TypeTimer {
    let dateTime = DateTime.fromFormat(this.today[this.time.next], "HH:mm");

    if (this.time.next === TimeNames.Imsak) {
      dateTime = DateTime.fromFormat(this.today[TimeNames.Imsak], "HH:mm");

      const isBeforeMidnight =
        DateTime.local() >
        DateTime.fromFormat(this.today[TimeNames.Imsak], "HH:mm");

      if (isBeforeMidnight) {
        dateTime = DateTime.fromFormat(
          this.tomorrow[TimeNames.Imsak],
          "HH:mm"
        ).plus({ days: 1 });
      }
    }

    const ms = dateTime.diffNow().toMillis();

    return secondSplit(ms / 1000);
  }
}
