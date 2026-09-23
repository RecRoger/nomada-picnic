export function urlParameter(text?: string): string {
  return !text ? '' : text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Descompone caracteres acentuados (ej: 'á' -> 'a' + '´')
    .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos (tildes/acentos)
    .replace(/ñ/g, 'n') // Sustituye la ñ por n
    .replace(/[^a-z0-9 -]/g, '') // Remueve caracteres especiales (símbolos, comas, etc.)
    .replace(/\s+/g, '-') // Reemplaza espacios por guion medio (-)
    .replace(/-+/g, '-'); // Elimina guiones dobles repetidos
}