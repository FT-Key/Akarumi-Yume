/**
 * Genera un número de orden único.
 * Formato: ORD-YYYYMMDD-XXXXX (ej: ORD-20240115-A3K2M)
 */
export function generateOrderNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${date}-${random}`;
}
