// "Add to calendar" for live webinars: builds a standard .ics file in the
// browser and downloads it (works with Google Calendar, Outlook and Apple).

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const fold = (line: string) => {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 73) {
    parts.push(rest.slice(0, 73));
    rest = ' ' + rest.slice(73);
  }
  parts.push(rest);
  return parts.join('\r\n');
};
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export interface IcsEvent {
  id: string;
  title: string;
  start: string; // ISO date
  durationMin?: number | null;
  url?: string | null;
  description?: string;
}

export function buildIcs(ev: IcsEvent): string {
  const start = new Date(ev.start);
  const end = new Date(start.getTime() + (ev.durationMin || 60) * 60000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Medident Academy//Doctor Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.id}@medident-ks.com`,
    `SEQUENCE:${Math.floor(Date.now() / 60000)}`, // a newer file updates the same entry
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(ev.description || '')}`,
    `LOCATION:${esc(ev.url || 'Medident Academy portal')}`,
    ...(ev.url ? [`URL:${ev.url}`] : []),
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(ev.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n');
}

export function downloadIcs(ev: IcsEvent, filename = 'medident-webinar.ics') {
  const blob = new Blob([buildIcs(ev)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Webinar timing helpers (join opens 30 min before, closes 3 h after start). */
export function webinarState(startIso: string, now = Date.now()): 'upcoming' | 'open' | 'past' {
  const start = new Date(startIso).getTime();
  if (now < start - 30 * 60 * 1000) return 'upcoming';
  if (now <= start + 3 * 60 * 60 * 1000) return 'open';
  return 'past';
}
