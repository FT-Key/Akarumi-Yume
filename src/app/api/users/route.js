import dbConnect from '../../../config/database.js';
import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/roleGuard.js';
import { createUser, listUsers } from '../../../controllers/userController.js';

// POST /api/users → Crear usuario
export const POST = withErrorHandler(async (request) => {
  const body = await request.json();
  return createUser(body);
});

// GET /api/users → Listar usuarios (solo admin)
export const GET = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;

  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listUsers(query);
});
