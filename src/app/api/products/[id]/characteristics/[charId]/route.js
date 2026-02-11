import { withErrorHandler } from '../../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../../middleware/auth.js';
import { requireRole } from '../../../../../../middleware/roleGuard.js';
import { deleteProductCharacteristic } from '../../../../../../controllers/productController.js';

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const { id } = await params; 
  return deleteProductCharacteristic(id, params.charId);
});
