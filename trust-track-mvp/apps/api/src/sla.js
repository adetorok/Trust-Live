const DEFAULT_BUSINESS_CALENDAR = {
  timeZone: 'America/New_York',
  workdayStartHour: 9,
  workdayEndHour: 17,
  workdays: [1, 2, 3, 4, 5]
};

function cloneDate(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date supplied to SLA engine');
  }
  return date;
}

function startOfNextWorkday(date, calendar) {
  const next = new Date(date);
  next.setHours(calendar.workdayStartHour, 0, 0, 0);

  if (date.getHours() >= calendar.workdayEndHour) {
    next.setDate(next.getDate() + 1);
  }

  while (!calendar.workdays.includes(next.getDay())) {
    next.setDate(next.getDate() + 1);
  }

  next.setHours(calendar.workdayStartHour, 0, 0, 0);
  return next;
}

function normalizeToBusinessTime(date, calendar) {
  const normalized = cloneDate(date);

  if (!calendar.workdays.includes(normalized.getDay())) {
    return startOfNextWorkday(normalized, calendar);
  }

  if (normalized.getHours() < calendar.workdayStartHour) {
    normalized.setHours(calendar.workdayStartHour, 0, 0, 0);
    return normalized;
  }

  if (normalized.getHours() >= calendar.workdayEndHour) {
    return startOfNextWorkday(normalized, calendar);
  }

  return normalized;
}

export function addBusinessMinutes(start, minutes, overrides = {}) {
  if (!Number.isFinite(minutes) || minutes < 0) {
    throw new Error('Business minutes must be a non-negative number');
  }

  const calendar = { ...DEFAULT_BUSINESS_CALENDAR, ...overrides };
  let cursor = normalizeToBusinessTime(start, calendar);
  let remaining = Math.round(minutes);

  while (remaining > 0) {
    const endOfDay = new Date(cursor);
    endOfDay.setHours(calendar.workdayEndHour, 0, 0, 0);

    const availableToday = Math.max(
      0,
      Math.floor((endOfDay.getTime() - cursor.getTime()) / 60000)
    );

    if (remaining <= availableToday) {
      cursor = new Date(cursor.getTime() + remaining * 60000);
      remaining = 0;
      break;
    }

    remaining -= availableToday;
    cursor = startOfNextWorkday(endOfDay, calendar);
  }

  return cursor;
}

export function calculateSlaTargets({
  receivedAt,
  firstResponseMinutes,
  resolutionMinutes,
  calendar
}) {
  return {
    firstResponseDueAt: addBusinessMinutes(
      receivedAt,
      firstResponseMinutes,
      calendar
    ),
    resolutionDueAt: addBusinessMinutes(
      receivedAt,
      resolutionMinutes,
      calendar
    )
  };
}

export const businessCalendarDefaults = DEFAULT_BUSINESS_CALENDAR;
