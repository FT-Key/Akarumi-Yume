import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { createAddress } from '../../../controllers/addressController.js';

// POST /api/addresses
export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return createAddress(body, user._id);
});
