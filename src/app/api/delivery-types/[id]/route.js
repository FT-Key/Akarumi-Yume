import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { 
  getDeliveryTypeById, 
  updateDeliveryType, 
  deleteDeliveryType 
} from '../../../../controllers/deliveryTypeController.js';

// GET /api/delivery-types/:id
export const GET = withErrorHandler(async (request, { params }) => {
  const { id } = await params;
  return getDeliveryTypeById(id);
});

// PUT /api/delivery-types/:id (solo admin)
export const PUT = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;

  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const body = await request.json();
  const { id } = await params;
  return updateDeliveryType(id, body);
});

// DELETE /api/delivery-types/:id (solo admin)
export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;

  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const { id } = await params;
  return deleteDeliveryType(id);
});