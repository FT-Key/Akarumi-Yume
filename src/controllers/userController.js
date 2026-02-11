import { User } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/users → Crear usuario
export async function createUser(body) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['firstName', 'lastName', 'email', 'password', 'dni']);
  if (error) return error;

  const user = await User.create(body);
  return successResponse(null, user, 201);
}

// GET /api/users/:id → Obtener usuario
export async function getUserById(id) {
  await dbConnect();
  const user = await User.findById(id).select('-password');
  if (!user) return errorResponse('Usuario no encontrado', 404);
  return successResponse(null, user);
}

// PUT /api/users/:id → Actualizar usuario
export async function updateUser(id, body) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select('-password');
  if (!user) return errorResponse('Usuario no encontrado', 404);
  return successResponse(null, user);
}

// DELETE /api/users/:id → Eliminar usuario
export async function deleteUser(id) {
  await dbConnect();
  const user = await User.findByIdAndDelete(id);
  if (!user) return errorResponse('Usuario no encontrado', 404);
  return successResponse(null, { message: 'Usuario eliminado' });
}

// GET /api/users → Listar usuarios (admin)
export async function listUsers(query) {
  await dbConnect();
  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip  = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  return paginatedResponse(null, { data: users, total, page, limit });
}
