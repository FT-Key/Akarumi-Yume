import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { getUserById, updateUser, deleteUser } from '../../../../controllers/userController.js';

// GET /api/users/:id
export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const { id } = await params; 
  return getUserById(id);
});

// PUT /api/users/:id
export const PUT = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  const { id } = await params; 
  return updateUser(id, body);
});

// DELETE /api/users/:id
export const DELETE = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const { id } = await params; 
  return deleteUser(id);
});

import { requireRole } from '../../../../middleware/roleGuard.js';
