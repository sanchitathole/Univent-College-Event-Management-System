const eventTimeZone = 'Asia/Kolkata';

const getDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: eventTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}${values.month}${values.day}`;
};

export const isUpcomingEvent = (value) => {
  const eventDate = getDateKey(value);
  const today = getDateKey(new Date());
  return eventDate !== null && eventDate >= today;
};

export const getEventStatus = (value) => {
  const eventDate = getDateKey(value);
  const today = getDateKey(new Date());

  if (eventDate === null) return 'Unknown';
  if (eventDate < today) return 'Completed';
  if (eventDate === today) return 'Today';
  return 'Upcoming';
};

export const formatEventDate = (value, options = {}) => new Date(value).toLocaleDateString(undefined, {
  timeZone: eventTimeZone,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  ...options
});

export const formatEventDateTime = (value) => new Date(value).toLocaleString(undefined, {
  timeZone: eventTimeZone,
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
});

export const toEventDateTimeInput = (value) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: eventTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date(value));
  const fields = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));

  return {
    date: `${fields.year}-${fields.month}-${fields.day}`,
    time: `${fields.hour}:${fields.minute}`
  };
};