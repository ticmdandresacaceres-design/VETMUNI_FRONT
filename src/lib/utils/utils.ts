const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export function resolveImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  return `${API_BASE}${path}`;
}

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