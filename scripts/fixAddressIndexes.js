import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script para limpiar índices duplicados en la colección Address
 * Ejecutar con: node scripts/fixAddressIndexes.js
 */
async function fixAddressIndexes() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado');

    const db = mongoose.connection.db;
    const collection = db.collection('addresses');

    // Ver índices actuales
    console.log('\n📋 Índices actuales:');
    const indexes = await collection.indexes();
    console.log(indexes);

    // Eliminar TODOS los índices excepto _id
    console.log('\n🗑️  Eliminando índices...');
    await collection.dropIndexes();
    console.log('✅ Índices eliminados');

    // Recrear índices correctos
    console.log('\n🔨 Creando nuevos índices...');
    
    await collection.createIndex({ user: 1 });
    console.log('✅ Índice creado: { user: 1 }');
    
    await collection.createIndex({ user: 1, isDefault: 1 });
    console.log('✅ Índice creado: { user: 1, isDefault: 1 }');
    
    await collection.createIndex({ user: 1, createdAt: -1 });
    console.log('✅ Índice creado: { user: 1, createdAt: -1 }');

    // Verificar índices finales
    console.log('\n📋 Índices finales:');
    const finalIndexes = await collection.indexes();
    console.log(finalIndexes);

    console.log('\n✅ ¡Índices arreglados correctamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Conexión cerrada');
    process.exit(0);
  }
}

fixAddressIndexes();