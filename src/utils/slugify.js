/**
 * Genera un slug único a partir de un texto.
 * Ejemplo: "Remera Básica 2024" → "remera-basica-2024"
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                   // Separar acentos
    .replace(/[\u0300-\u036f]/g, '')    // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')       // Solo alfanuméricos, espacios y guiones
    .replace(/[\s]+/g, '-')            // Espacios → guiones
    .replace(/-+/g, '-')               // Multiples guiones → uno solo
    .trim();
}
