import { Product, ProductImage, ProductCharacteristic } from '../models/index.js';
import { uploadImage, deleteImage } from '../lib/firebase.js';
import dbConnect from '../config/database.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';
import { validateRequiredFields } from '../middleware/validateRequest.js';

// POST /api/products → Crear producto
export async function createProduct(body) {
  await dbConnect();

  const { error } = validateRequiredFields(body, ['name', 'price', 'category']);
  if (error) return error;

  const product = await Product.create(body);
  return successResponse(null, product, 201);
}

// GET /api/products → Listar productos (con filtros y paginación)
export async function listProducts(query) {
  await dbConnect();

  const page     = parseInt(query.page) || 1;
  const limit    = parseInt(query.limit) || 20;
  const skip     = (page - 1) * limit;
  const filters  = {};

  if (query.category)  filters.category = query.category;
  if (query.minPrice)  filters.price = { ...filters.price, $gte: Number(query.minPrice) };
  if (query.maxPrice)  filters.price = { ...filters.price, $lte: Number(query.maxPrice) };
  if (query.featured) filters.isFeatured = true;
  if (query.search)    filters.$text = { $search: query.search };
  filters.isActive = true;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate('category')
      .populate({ path: 'images', options: { sort: { order: 1 } } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Product.countDocuments(filters),
  ]);

  return paginatedResponse(null, { data: products, total, page, limit });
}

// GET /api/products/:id → Obtener producto completo
export async function getProductById(id) {
  await dbConnect();

  const product = await Product.findById(id)
    .populate('category')
    .populate({ path: 'images', options: { sort: { order: 1 } } })
    .populate({ path: 'characteristics', options: { sort: { order: 1 } } });

  if (!product) return errorResponse('Producto no encontrado', 404);
  return successResponse(null, product);
}

// PUT /api/products/:id → Actualizar producto
export async function updateProduct(id, body) {
  await dbConnect();
  const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!product) return errorResponse('Producto no encontrado', 404);
  return successResponse(null, product);
}

// DELETE /api/products/:id → Eliminar producto
export async function deleteProduct(id) {
  await dbConnect();
  const product = await Product.findByIdAndDelete(id);
  if (!product) return errorResponse('Producto no encontrado', 404);

  // Limpiar imágenes y características asociadas
  await ProductImage.deleteMany({ product: id });
  await ProductCharacteristic.deleteMany({ product: id });

  return successResponse(null, { message: 'Producto eliminado' });
}

// POST /api/products/:id/images → Agregar imagen
export async function addProductImage(productId, fileBuffer, altText, contentType) {
  await dbConnect();

  const product = await Product.findById(productId);
  if (!product) return errorResponse('Producto no encontrado', 404);

  const storagePath = `products/${productId}/${Date.now()}.jpg`;
  const { url } = await uploadImage(fileBuffer, storagePath, contentType);

  // Si no hay imágenes, esta es la principal
  const existingImages = await ProductImage.countDocuments({ product: productId });

  const image = await ProductImage.create({
    product:   productId,
    url,
    storagePath,
    altText,
    isPrimary: existingImages === 0,
    order:     existingImages,
  });

  return successResponse(null, image, 201);
}

// DELETE /api/products/:id/images/:imageId → Eliminar imagen
export async function deleteProductImage(productId, imageId) {
  await dbConnect();

  const image = await ProductImage.findOne({ _id: imageId, product: productId });
  if (!image) return errorResponse('Imagen no encontrada', 404);

  await deleteImage(image.storagePath);
  await image.deleteOne();

  // Si era la principal, hacer otra imagen primary
  if (image.isPrimary) {
    const nextImage = await ProductImage.findOne({ product: productId }).sort({ order: 1 });
    if (nextImage) {
      nextImage.isPrimary = true;
      await nextImage.save();
    }
  }

  return successResponse(null, { message: 'Imagen eliminada' });
}

// POST /api/products/:id/characteristics → Agregar característica
export async function addProductCharacteristic(productId, body) {
  await dbConnect();

  const product = await Product.findById(productId);
  if (!product) return errorResponse('Producto no encontrado', 404);

  const { error } = validateRequiredFields(body, ['key', 'label', 'value', 'valueType']);
  if (error) return error;

  const characteristic = await ProductCharacteristic.create({ ...body, product: productId });
  return successResponse(null, characteristic, 201);
}

// DELETE /api/products/:id/characteristics/:charId → Eliminar característica
export async function deleteProductCharacteristic(productId, charId) {
  await dbConnect();

  const char = await ProductCharacteristic.findOne({ _id: charId, product: productId });
  if (!char) return errorResponse('Característica no encontrada', 404);

  await char.deleteOne();
  return successResponse(null, { message: 'Característica eliminada' });
}
