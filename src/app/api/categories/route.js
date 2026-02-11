import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/roleGuard.js';
import { createCategory, listCategories } from '../../../controllers/categoryController.js';

export const GET = withErrorHandler(async (request) => {
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listCategories(query);
});

export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;
  const body = await request.json();
  return createCategory(body);
});
