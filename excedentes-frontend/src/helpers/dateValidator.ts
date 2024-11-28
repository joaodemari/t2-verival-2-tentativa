import { useState } from "react";

export function parseDateStrWithGMT3(dateStr: string) {
  const date = new Date(dateStr);
  return parseDateWithGMT3(date);
}

export function parseDateWithGMT3(date: Date) {
  const currentOffset = date.getTimezoneOffset();
  const targetOffset = 3 * 60;
  const offsetDiff = targetOffset + currentOffset;
  date.setMinutes(date.getMinutes() + offsetDiff);
  return date;
}

export const isExpirationClose = (expirationDate: Date): boolean => {
  const minExpirationDate = new Date();
  minExpirationDate.setDate(minExpirationDate.getDate() + 13);
  return expirationDate <= minExpirationDate;
};

export const handleExpirationDateChange = (value: string) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);

  const dateParts: string[] = value.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[2]);

  if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
    const newDate = new Date(year, month, day);
    setExpirationDate(newDate);
    setIsDisabled(isExpirationClose(newDate));
  }

  return { isDisabled, expirationDate, handleExpirationDateChange };
};
