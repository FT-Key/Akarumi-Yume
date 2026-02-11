import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { getAddressesByUser } from '../../../../../controllers/addressController.js';

// GET /api/users/:id/addresses
export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const { id } = await params; 
  return getAddressesByUser(id);
});
