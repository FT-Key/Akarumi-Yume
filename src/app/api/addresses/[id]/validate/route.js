import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { validateAddress } from '../../../../../controllers/addressController.js';

// POST /api/addresses/:id/validate
export const POST = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const { id } = await params; 
  return validateAddress(id);
});
