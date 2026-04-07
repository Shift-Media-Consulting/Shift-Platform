/** Format any date as dd.mm.yyyy — used consistently everywhere in the platform */
export function fmtDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}
