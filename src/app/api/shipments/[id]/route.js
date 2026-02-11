import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { getShipmentById, updateShipmentStatus } from '../../../../controllers/shipmentController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const { id } = await params; 
  return getShipmentById(id);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  const { id } = await params; 
  return updateShipmentStatus(id, body);
});
