import { withErrorHandler } from '../../../../middleware/errorHandler.js';
import { authenticate } from '../../../../middleware/auth.js';
import { getAddressById, updateAddress, deleteAddress } from '../../../../controllers/addressController.js';

export const GET    = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const { id } = await params; 
  return getAddressById(id);
});

export const PUT    = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const body = await request.json();
  const { id } = await params; 
  return updateAddress(id, body);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const { error } = await authenticate(request);
  if (error) return error;
  const { id } = await params; 
  return deleteAddress(id);
});
