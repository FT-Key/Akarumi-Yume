import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { requireRole } from '../../../../middleware/roleGuard.js';
import { getProductById, updateProduct, deleteProduct } from '../../../../controllers/productController.js';

export const GET    = withErrorHandler(async (request, { params }) => {
  const { id } = await params; 
  return getProductById(id);
});

export const PUT    = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  const { id } = await params; 
  return updateProduct(id, body);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const { id } = await params; 
  return deleteProduct(id);
});
