import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { listOrders } from '../../../../../controllers/orderController.js';

// GET /api/users/:id/orders
export const GET = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  const { id } = await params; 
  return listOrders({ ...query, user: id }, id, 'USER');
});
