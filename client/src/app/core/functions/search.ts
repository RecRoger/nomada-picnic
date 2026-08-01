export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres combinados (ej: 'ó' -> 'o' + '´')
    .replace(/[\u0300-\u036f]/g, '') // Elimina los signos de acentuación descompuestos
    .replace(/[^a-z0-9]/g, ''); // Elimina espacios, guiones y cualquier carácter no alfanumérico
}