import { TypeTimer } from "@/lib/types";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import { hourFormat, hourFormat12 } from "@/lib/const";

export function cx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function secondSplit(second: number): TypeTimer {
  return [
    Math.floor(second / 3600),
    Math.floor((second % 3600) / 60),
    Math.floor(second % 60),
  ];
}

export function adjustedTime(adjustment: number, time: string = "00:00") {
  const timeValue = DateTime.fromFormat(time, hourFormat);
  const newTime = timeValue.plus({ minutes: adjustment });
  return newTime.toFormat(hourFormat);
}

export function formattedTime(
  timeFormat: "12" | "24",
  baseTime: string = "00:00"
) {
  return DateTime.fromFormat(baseTime, hourFormat)
    .toFormat(timeFormat === "12" ? hourFormat12 : hourFormat)
    .toLowerCase();
}
