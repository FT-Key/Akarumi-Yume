/**
 * Validar email
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validar DNI argentino
 */
export function isValidDNI(dni) {
  const cleaned = dni.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 8;
}

/**
 * Validar teléfono argentino
 */
export function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
}

/**
 * Validar password
 */
export function isValidPassword(password) {
  return password.length >= 8;
}

/**
 * Validar código postal argentino
 */
export function isValidPostalCode(code) {
  // Formatos: 4000, T4000, T4000ABC
  const re = /^[A-Z]?\d{4}[A-Z]{0,3}$/;
  return re.test(code);
}
