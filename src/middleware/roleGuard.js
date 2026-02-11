import { errorResponse } from '../utils/response.js';

/**
 * Verificar que el usuario tiene el rol requerido.
 * @param {object} user - Objeto usuario (ya autenticado)
 * @param {string[]} allowedRoles - Roles permitidos
 * @returns {{ error: Response | null }}
 */
export function requireRole(user, allowedRoles) {
  if (!allowedRoles.includes(user.role)) {
    return { error: errorResponse('No tienes permiso para esta acción', 403) };
  }
  return { error: null };
}
