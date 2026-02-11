/**
 * Wrapper de Firebase Storage
 * Centraliza todas las operaciones de almacenamiento de imágenes.
 */

// TODO: Instalar SDK → npm install firebase-admin
// import admin from 'firebase-admin';

/**
 * Subir imagen al bucket de Firebase Storage
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} storagePath - Ruta destino (ej: "products/remera-001.jpg")
 * @param {string} contentType - MIME type (ej: "image/jpeg")
 * @returns {{ url: string, storagePath: string }}
 */
export async function uploadImage(fileBuffer, storagePath, contentType = 'image/jpeg') {
  // const bucket = admin.storage().bucket();
  // const file = bucket.file(storagePath);
  // await file.save(fileBuffer, { contentType });
  // await file.makePublic();
  // const url = file.publicUrl();
  // return { url, storagePath };
  throw new Error('Firebase Storage no configurado aún');
}

/**
 * Eliminar imagen del bucket
 * @param {string} storagePath - Ruta del archivo a eliminar
 */
export async function deleteImage(storagePath) {
  // const bucket = admin.storage().bucket();
  // await bucket.file(storagePath).delete();
  throw new Error('Firebase Storage no configurado aún');
}

/**
 * Obtener URL pública de una imagen
 * @param {string} storagePath
 * @returns {string} URL pública
 */
export function getImageUrl(storagePath) {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  return `https://storage.googleapis.com/${bucketName}/${storagePath}`;
}
