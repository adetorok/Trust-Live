import { DateTime } from 'luxon';

const DEFAULT_BUSINESS_CALENDAR = {
  timeZone: 'America/New_York',
  workdayStartHour: 9,
  workdayEndHour: 17,
  workdays: [1, 2, 3, 4, 5]
};

function validateCalendar(calendar) {
  if (calendar.workdayStartHour >= calendar.workdayEndHour) {
    throw new Error('Business-day start must be before business-day end');
  }

  if (!Array.isArray(calendar.workdays) || calendar.workdays.length === 0) {
    throw new Error('At least one business day is required');
  }
}

function toSiteTime(value, calendar) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date supplied to SLA engine');
  }

  const siteTime = DateTime.fromJSDate(date, { zone: 'utc' }).setZone(calendar.timeZone);
  if (!siteTime.isValid) {
    throw new Error(`Invalid business-calendar time zone: ${calendar.timeZone}`);
  }

  return siteTime;
}

function atBusinessDayStart(dateTime, calendar) {
  return dateTime.startOf('day').set({
    hour: calendar.workdayStartHour,
    minute: 0,
    second: 0,
    millisecond: 0
  });
}

function nextWorkday(dateTime, calendar) {
  let next = atBusinessDayStart(dateTime.plus({ days: 1 }), calendar);

  while (!calendar.workdays.includes(next.weekday)) {
    next = atBusinessDayStart(next.plus({ days: 1 }), calendar);
  }

  return next;
}

function normalizeToBusinessTime(value, calendar) {
  let cursor = toSiteTime(value, calendar);

  if (!calendar.workdays.includes(cursor.weekday)) {
    while (!calendar.workdays.includes(cursor.weekday)) {
      cursor = cursor.plus({ days: 1 });
    }
    return atBusinessDayStart(cursor, calendar);
  }

  const dayStart = atBusinessDayStart(cursor, calendar);
  const dayEnd = cursor.startOf('day').set({
    hour: calendar.workdayEndHour,
    minute: 0,
    second: 0,
    millisecond: 0
  });

  if (cursor < dayStart) return dayStart;
  if (cursor >= dayEnd) return nextWorkday(cursor, calendar);
  return cursor;
}

export function addBusinessMinutes(start, minutes, overrides = {}) {
  if (!Number.isFinite(minutes) || minutes < 0) {
    throw new Error('Business minutes must be a non-negative number');
  }

  const calendar = { ...DEFAULT_BUSINESS_CALENDAR, ...overrides };
  validateCalendar(calendar);

  let cursor = normalizeToBusinessTime(start, calendar);
  let remaining = Math.round(minutes);

  while (remaining > 0) {
    const endOfDay = cursor.startOf('day').set({
      hour: calendar.workdayEndHour,
      minute: 0,
      second: 0,
      millisecond: 0
    });
    const availableToday = Math.max(0, Math.floor(endOfDay.diff(cursor, 'minutes').minutes));

    if (remaining <= availableToday) {
      cursor = cursor.plus({ minutes: remaining });
      remaining = 0;
    } else {
      remaining -= availableToday;
      cursor = nextWorkday(cursor, calendar);
    }
  }

  return cursor.toUTC().toJSDate();
}

export function calculateSlaTargets({
  receivedAt,
  firstResponseMinutes,
  resolutionMinutes,
  calendar
}) {
  return {
    firstResponseDueAt: addBusinessMinutes(receivedAt, firstResponseMinutes, calendar),
    resolutionDueAt: addBusinessMinutes(receivedAt, resolutionMinutes, calendar)
  };
}

export const businessCalendarDefaults = DEFAULT_BUSINESS_CALENDAR;
