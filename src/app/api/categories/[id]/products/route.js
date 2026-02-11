import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { getProductsByCategory } from '../../../../../controllers/categoryController.js';

export const GET = withErrorHandler(async (request, { params }) => {
  const { id } = await params; 
  return getProductsByCategory(id);
});
