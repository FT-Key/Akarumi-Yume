import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { requireRole } from '../../../../../middleware/roleGuard.js';
import { addProductCharacteristic } from '../../../../../controllers/productController.js';

export const POST = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  const { id } = await params; 
  return addProductCharacteristic(id, body);
});
