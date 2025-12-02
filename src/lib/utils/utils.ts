export function formatDate(dateString: string): string {
  // Dividir la fecha en partes (año, mes, día)
  const [year, month, day] = dateString.split('-').map(Number)
  
  // Crear la fecha usando los componentes locales (evita problemas de zona horaria)
  const date = new Date(year, month - 1, day)
  
  // Formatear la fecha
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return date.toLocaleDateString('es-ES', options)
}