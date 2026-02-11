import { withErrorHandler } from '../../../middleware/errorHandler.js';
import { authenticate } from '../../../middleware/auth.js';
import { createOrder, listOrders } from '../../../controllers/orderController.js';

export const POST = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  return createOrder(body, user._id);
});

export const GET = withErrorHandler(async (request) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const query = Object.fromEntries(new URL(request.url).searchParams);
  return listOrders(query, user._id, user.role);
});
