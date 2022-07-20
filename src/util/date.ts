import { DateTime, SystemZone } from 'luxon';

export const parseDateToLocal = (date: string, format = 'LLL d, y') => {
  const luxonDate = DateTime.fromISO(date, { zone: 'utc' });
  if (!luxonDate.isValid) return date;
  return luxonDate.setZone(new SystemZone().name).toFormat(format);
};
