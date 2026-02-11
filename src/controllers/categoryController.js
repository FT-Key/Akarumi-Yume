import { Category, Product } from '../models/index.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

export async function createCategory(body) {
  await dbConnect();
  const { error } = validateRequiredFields(body, ['name']);
  if (error) return error;
  const category = await Category.create(body);
  return successResponse(null, category, 201);
}

export async function listCategories(query) {
  await dbConnect();
  const categories = await Category.find({ isActive: true })
    .populate('parent')
    .sort({ order: 1 });
  return successResponse(null, categories);
}

export async function getCategoryById(id) {
  await dbConnect();
  const category = await Category.findById(id).populate('parent').populate('children');
  if (!category) return errorResponse('Categoría no encontrada', 404);
  return successResponse(null, category);
}

export async function updateCategory(id, body) {
  await dbConnect();
  const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!category) return errorResponse('Categoría no encontrada', 404);
  return successResponse(null, category);
}

export async function deleteCategory(id) {
  await dbConnect();
  // No eliminar si tiene productos
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    return errorResponse('No se puede eliminar una categoría con productos', 400);
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) return errorResponse('Categoría no encontrada', 404);
  return successResponse(null, { message: 'Categoría eliminada' });
}

export async function getProductsByCategory(categoryId) {
  await dbConnect();
  const products = await Product.find({ category: categoryId, isActive: true })
    .populate({ path: 'images', options: { sort: { order: 1 } } })
    .sort({ createdAt: -1 });
  return successResponse(null, products);
}
