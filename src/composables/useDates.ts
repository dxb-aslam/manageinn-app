/**
 * useDates — date utilities ported from the web app.
 *
 * Pure functions, no reactivity. Frappe sends + accepts ISO "YYYY-MM-DD"
 * strings everywhere; we parse to local midnight to avoid TZ surprises.
 */

export function parseDate(iso: string): Date {
  return new Date(iso + 'T00:00:00');
}

export function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

export function todayObj(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function todayISO(): string {
  return isoDate(todayObj());
}

export function formatDateLong(iso: string): string {
  if (!iso) return '—';
  return parseDate(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(iso: string): string {
  if (!iso) return '—';
  return parseDate(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function initials(name: string | null | undefined): string {
  return (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}
