import { withErrorHandler } from '../../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../../middleware/auth.js';
import { requireRole } from '../../../../../middleware/roleGuard.js';
import { addProductImage } from '../../../../../controllers/productController.js';

// POST /api/products/:id/images
export const POST = withErrorHandler(async (request, { params }) => {
  const { user, error } = await authenticate(request);
  if (error) return error;
  const { error: roleError } = requireRole(user, ['ADMIN']);
  if (roleError) return roleError;

  const formData = await request.formData();
  const file     = formData.get('image');
  const altText  = formData.get('altText') || '';

  if (!file) {
    return new Response(JSON.stringify({ success: false, error: { message: 'Se requiere imagen' } }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { id } = await params; 
  return addProductImage(id, buffer, altText, file.type);
});
