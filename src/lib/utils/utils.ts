export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "Sin fecha";
  const [year, month, day] = dateString.split('-').map(Number)
  
  const date = new Date(year, month - 1, day)
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return date.toLocaleDateString('es-ES', options)
}