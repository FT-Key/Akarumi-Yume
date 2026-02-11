import { errorResponse } from '../utils/response.js';

/**
 * Validar que los campos requeridos estén presentes en el body.
 * @param {object} body - Body parseado de la request
 * @param {string[]} requiredFields - Array de campos requeridos
 * @returns {{ error: Response | null }}
 */
export function validateRequiredFields(body, requiredFields) {
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );

  if (missing.length > 0) {
    return {
      error: errorResponse(`Campos requeridos faltantes: ${missing.join(', ')}`, 400),
    };
  }

  return { error: null };
}
