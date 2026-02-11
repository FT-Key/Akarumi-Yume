import { errorResponse } from '../utils/response.js';

/**
 * Wrapper para routes que captura errores automáticamente.
 * Uso:
 *   export const GET = withErrorHandler(async (req) => { ... });
 */
export function withErrorHandler(handler) {
  return async function (request, context) {
    try {
      return await handler(request, context);
    } catch (err) {
      console.error('[Error]', err);

      // Errores de validación de Mongoose
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return errorResponse(messages.join('; '), 400);
      }

      // Errores de clave duplicada (unique index)
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'campo';
        return errorResponse(`El ${field} ya existe`, 409);
      }

      // Error genérico
      return errorResponse(
        process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
        500
      );
    }
  };
}
