import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/roleGuard.js';
import { createDeliveryType, listDeliveryTypes } from '../../../controllers/deliveryTypeController.js';

// GET /api/delivery-types → Listar (público)
export const GET = withErrorHandler(async (request) => {
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listDeliveryTypes(query);
});

// POST /api/delivery-types → Crear (solo admin)
export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;

  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const body = await request.json();
  return createDeliveryType(body);
});