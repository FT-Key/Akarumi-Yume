import mongoose from 'mongoose';
import {
  Category,
  Product,
  ProductImage,
  ProductCharacteristic,
} from '../src/models/index.js';
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
console.log("mongo uri: ", MONGODB_URI)

// Categorías jerárquicas
const categories = [
  // Ropa
  {
    name: 'Ropa',
    description: 'Vestimenta para toda la familia',
    slug: 'ropa',
    parent: null,
    isActive: true,
    order: 1,
  },
  {
    name: 'Remeras',
    description: 'Remeras casuales y deportivas',
    slug: 'remeras',
    parentSlug: 'ropa',
    isActive: true,
    order: 1,
  },
  {
    name: 'Pantalones',
    description: 'Pantalones y jeans',
    slug: 'pantalones',
    parentSlug: 'ropa',
    isActive: true,
    order: 2,
  },
  {
    name: 'Buzos',
    description: 'Buzos y hoodies',
    slug: 'buzos',
    parentSlug: 'ropa',
    isActive: true,
    order: 3,
  },
  // Electrónica
  {
    name: 'Electrónica',
    description: 'Tecnología y gadgets',
    slug: 'electronica',
    parent: null,
    isActive: true,
    order: 2,
  },
  {
    name: 'Celulares',
    description: 'Smartphones y accesorios',
    slug: 'celulares',
    parentSlug: 'electronica',
    isActive: true,
    order: 1,
  },
  {
    name: 'Auriculares',
    description: 'Auriculares y headphones',
    slug: 'auriculares',
    parentSlug: 'electronica',
    isActive: true,
    order: 2,
  },
  // Hogar
  {
    name: 'Hogar',
    description: 'Productos para el hogar',
    slug: 'hogar',
    parent: null,
    isActive: true,
    order: 3,
  },
  {
    name: 'Decoración',
    description: 'Elementos decorativos',
    slug: 'decoracion',
    parentSlug: 'hogar',
    isActive: true,
    order: 1,
  },
  // Deportes
  {
    name: 'Deportes',
    description: 'Artículos deportivos',
    slug: 'deportes',
    parent: null,
    isActive: true,
    order: 4,
  },
  {
    name: 'Zapatillas',
    description: 'Calzado deportivo',
    slug: 'zapatillas',
    parentSlug: 'deportes',
    isActive: true,
    order: 1,
  },
];

// Productos con toda su información
const products = [
  // REMERAS
  {
    name: 'Remera Básica Negra',
    slug: 'remera-basica-negra',
    description: 'Remera de algodón 100% de excelente calidad. Perfecta para el uso diario, cómoda y duradera. Corte clásico que se adapta a todos los estilos.',
    shortDescription: 'Remera básica de algodón 100%',
    price: 5000,
    compareAtPrice: 7000,
    stock: 50,
    sku: 'REM-BAS-NEG-001',
    categorySlug: 'remeras',
    trackInventory: true,
    weight: 0.2,
    dimensions: { length: 60, width: 40, height: 2, unit: 'cm' },
    isActive: true,
    isFeatured: true,
    tags: ['remera', 'basica', 'algodon', 'casual', 'negro'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        altText: 'Remera básica negra vista frontal',
        isPrimary: true,
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        altText: 'Remera básica negra vista posterior',
        isPrimary: false,
        order: 1,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Negro', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['XS', 'S', 'M', 'L', 'XL'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '100% Algodón', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'washable', label: 'Lavable en lavarropas', value: true, valueType: 'boolean', order: 3, isFeatured: false, isFilterable: false },
      { key: 'fit', label: 'Corte', value: 'Regular', valueType: 'text', order: 4, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Remera Oversize Blanca',
    slug: 'remera-oversize-blanca',
    description: 'Remera oversize de estilo urbano. Confeccionada en algodón premium, perfecta para looks casuales y cómodos. Diseño minimalista y versátil.',
    shortDescription: 'Remera oversize de algodón premium',
    price: 6500,
    compareAtPrice: 9000,
    stock: 35,
    sku: 'REM-OVR-BLA-002',
    categorySlug: 'remeras',
    trackInventory: true,
    weight: 0.25,
    dimensions: { length: 70, width: 50, height: 2, unit: 'cm' },
    isActive: true,
    isFeatured: true,
    tags: ['remera', 'oversize', 'algodon', 'urbano', 'blanco'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800',
        altText: 'Remera oversize blanca',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Blanco', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['S', 'M', 'L', 'XL'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '100% Algodón Premium', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'fit', label: 'Corte', value: 'Oversize', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
    ],
  },
  {
    name: 'Remera Estampada Vintage',
    slug: 'remera-estampada-vintage',
    description: 'Remera con estampado vintage retro. Diseño único que refleja el estilo de los años 80 y 90. Fabricada en algodón suave y confortable.',
    shortDescription: 'Remera con estampado retro',
    price: 7500,
    stock: 25,
    sku: 'REM-EST-VIN-003',
    categorySlug: 'remeras',
    trackInventory: true,
    weight: 0.22,
    isActive: true,
    isFeatured: false,
    tags: ['remera', 'estampada', 'vintage', 'retro', 'colores'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
        altText: 'Remera estampada vintage',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Multicolor', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['M', 'L', 'XL'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '95% Algodón, 5% Elastano', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'fit', label: 'Corte', value: 'Regular', valueType: 'text', order: 3, isFeatured: false, isFilterable: true },
      { key: 'print', label: 'Tipo de estampado', value: 'Serigrafia', valueType: 'text', order: 4, isFeatured: false, isFilterable: false },
    ],
  },

  // PANTALONES
  {
    name: 'Jean Clásico Azul',
    slug: 'jean-clasico-azul',
    description: 'Jean clásico de denim resistente. Corte recto tradicional que nunca pasa de moda. Cinco bolsillos funcionales. Ideal para uso diario.',
    shortDescription: 'Jean clásico de denim',
    price: 15000,
    compareAtPrice: 20000,
    stock: 40,
    sku: 'PAN-JEA-AZU-001',
    categorySlug: 'pantalones',
    trackInventory: true,
    weight: 0.6,
    isActive: true,
    isFeatured: true,
    tags: ['jean', 'denim', 'clasico', 'azul', 'pantalon'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542272454315-7f6d89b73d49?w=800',
        altText: 'Jean clásico azul',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Azul', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['28', '30', '32', '34', '36', '38'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '98% Algodón, 2% Elastano', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'fit', label: 'Corte', value: 'Recto', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'washType', label: 'Lavado', value: 'Stone wash', valueType: 'text', order: 4, isFeatured: false, isFilterable: false },
    ],
  },
  {
    name: 'Pantalón Jogger Negro',
    slug: 'pantalon-jogger-negro',
    description: 'Pantalón jogger deportivo con puño en el tobillo. Fabricado en tela liviana y elástica. Perfecto para entrenar o uso casual. Muy cómodo.',
    shortDescription: 'Jogger deportivo liviano',
    price: 12000,
    compareAtPrice: 16000,
    stock: 30,
    sku: 'PAN-JOG-NEG-002',
    categorySlug: 'pantalones',
    trackInventory: true,
    weight: 0.4,
    isActive: true,
    isFeatured: false,
    tags: ['jogger', 'deportivo', 'negro', 'comodo', 'pantalon'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
        altText: 'Pantalón jogger negro',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Negro', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['S', 'M', 'L', 'XL'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '85% Poliéster, 15% Elastano', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'fit', label: 'Corte', value: 'Jogger', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
    ],
  },

  // BUZOS
  {
    name: 'Buzo Canguro Gris',
    slug: 'buzo-canguro-gris',
    description: 'Buzo con capucha y bolsillo canguro. Interior forrado en felpa suave. Perfecto para los días fríos. Diseño urbano y cómodo.',
    shortDescription: 'Buzo con capucha y bolsillo',
    price: 18000,
    compareAtPrice: 25000,
    stock: 45,
    sku: 'BUZ-CAN-GRI-001',
    categorySlug: 'buzos',
    trackInventory: true,
    weight: 0.7,
    isActive: true,
    isFeatured: true,
    tags: ['buzo', 'hoodie', 'capucha', 'gris', 'invierno'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        altText: 'Buzo canguro gris',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Gris', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['S', 'M', 'L', 'XL', 'XXL'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '80% Algodón, 20% Poliéster', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'hasHood', label: 'Con capucha', value: true, valueType: 'boolean', order: 3, isFeatured: true, isFilterable: true },
      { key: 'hasPocket', label: 'Bolsillo canguro', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Buzo Liso Azul Marino',
    slug: 'buzo-liso-azul-marino',
    description: 'Buzo cuello redondo sin capucha. Diseño minimalista y elegante. Tejido de alta calidad que mantiene el calor. Perfecto para todo uso.',
    shortDescription: 'Buzo cuello redondo minimalista',
    price: 14000,
    stock: 38,
    sku: 'BUZ-LIS-AZU-002',
    categorySlug: 'buzos',
    trackInventory: true,
    weight: 0.55,
    isActive: true,
    isFeatured: false,
    tags: ['buzo', 'liso', 'azul', 'elegante', 'sin-capucha'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        altText: 'Buzo liso azul marino',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Azul Marino', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['M', 'L', 'XL'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '90% Algodón, 10% Poliéster', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'hasHood', label: 'Con capucha', value: false, valueType: 'boolean', order: 3, isFeatured: false, isFilterable: true },
    ],
  },

  // CELULARES
  {
    name: 'Smartphone Pro Max 256GB',
    slug: 'smartphone-pro-max-256gb',
    description: 'Smartphone de última generación con procesador de alto rendimiento. Pantalla AMOLED de 6.7 pulgadas. Cámara triple de 108MP. Batería de larga duración.',
    shortDescription: 'Smartphone de alta gama',
    price: 450000,
    compareAtPrice: 550000,
    stock: 15,
    sku: 'CEL-PRO-MAX-001',
    categorySlug: 'celulares',
    trackInventory: true,
    weight: 0.25,
    isActive: true,
    isFeatured: true,
    tags: ['smartphone', 'celular', 'alta-gama', '5g', 'camara'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592286927505-36318c0b2e4e?w=800',
        altText: 'Smartphone Pro Max vista frontal',
        isPrimary: true,
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        altText: 'Smartphone Pro Max vista posterior',
        isPrimary: false,
        order: 1,
      },
    ],
    characteristics: [
      { key: 'storage', label: 'Almacenamiento', value: 256, valueType: 'number', unit: 'GB', order: 0, isFeatured: true, isFilterable: true },
      { key: 'ram', label: 'Memoria RAM', value: 12, valueType: 'number', unit: 'GB', order: 1, isFeatured: true, isFilterable: true },
      { key: 'screen', label: 'Pantalla', value: '6.7" AMOLED', valueType: 'text', order: 2, isFeatured: true, isFilterable: false },
      { key: 'camera', label: 'Cámara principal', value: 108, valueType: 'number', unit: 'MP', order: 3, isFeatured: true, isFilterable: false },
      { key: 'battery', label: 'Batería', value: 5000, valueType: 'number', unit: 'mAh', order: 4, isFeatured: false, isFilterable: false },
      { key: 'color', label: 'Color', value: 'Negro', valueType: 'color', order: 5, isFeatured: true, isFilterable: true },
      { key: '5g', label: 'Compatible 5G', value: true, valueType: 'boolean', order: 6, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Smartphone Mid 128GB',
    slug: 'smartphone-mid-128gb',
    description: 'Smartphone de gama media con excelente relación precio-calidad. Pantalla de 6.5 pulgadas. Cámara dual de 64MP. Batería de 4500mAh.',
    shortDescription: 'Smartphone gama media',
    price: 180000,
    compareAtPrice: 220000,
    stock: 28,
    sku: 'CEL-MID-128-002',
    categorySlug: 'celulares',
    trackInventory: true,
    weight: 0.22,
    isActive: true,
    isFeatured: false,
    tags: ['smartphone', 'celular', 'gama-media', '4g'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        altText: 'Smartphone Mid',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'storage', label: 'Almacenamiento', value: 128, valueType: 'number', unit: 'GB', order: 0, isFeatured: true, isFilterable: true },
      { key: 'ram', label: 'Memoria RAM', value: 6, valueType: 'number', unit: 'GB', order: 1, isFeatured: true, isFilterable: true },
      { key: 'screen', label: 'Pantalla', value: '6.5" IPS LCD', valueType: 'text', order: 2, isFeatured: true, isFilterable: false },
      { key: 'camera', label: 'Cámara principal', value: 64, valueType: 'number', unit: 'MP', order: 3, isFeatured: true, isFilterable: false },
      { key: 'color', label: 'Color', value: 'Azul', valueType: 'color', order: 4, isFeatured: true, isFilterable: true },
    ],
  },

  // AURICULARES
  {
    name: 'Auriculares Inalámbricos Premium',
    slug: 'auriculares-inalambricos-premium',
    description: 'Auriculares Bluetooth con cancelación activa de ruido. Batería de hasta 30 horas. Sonido Hi-Fi de alta fidelidad. Cómodos para uso prolongado.',
    shortDescription: 'Auriculares Bluetooth con ANC',
    price: 35000,
    compareAtPrice: 45000,
    stock: 22,
    sku: 'AUR-INA-PRE-001',
    categorySlug: 'auriculares',
    trackInventory: true,
    weight: 0.3,
    isActive: true,
    isFeatured: true,
    tags: ['auriculares', 'bluetooth', 'inalambrico', 'anc', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        altText: 'Auriculares premium',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Negro', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'connectivity', label: 'Conectividad', value: 'Bluetooth 5.2', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'anc', label: 'Cancelación de ruido', value: true, valueType: 'boolean', order: 2, isFeatured: true, isFilterable: true },
      { key: 'battery', label: 'Batería', value: 30, valueType: 'number', unit: 'hs', order: 3, isFeatured: true, isFilterable: false },
      { key: 'wireless', label: 'Inalámbrico', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Auriculares In-Ear Sport',
    slug: 'auriculares-in-ear-sport',
    description: 'Auriculares deportivos resistentes al agua. Diseño ergonómico que no se caen. Perfecto para correr y entrenar. Batería de 8 horas.',
    shortDescription: 'Auriculares deportivos resistentes',
    price: 12000,
    stock: 40,
    sku: 'AUR-SPO-001',
    categorySlug: 'auriculares',
    trackInventory: true,
    weight: 0.05,
    isActive: true,
    isFeatured: false,
    tags: ['auriculares', 'deportivo', 'resistente-agua', 'bluetooth'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        altText: 'Auriculares deportivos',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Rojo', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'connectivity', label: 'Conectividad', value: 'Bluetooth 5.0', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'waterproof', label: 'Resistente al agua', value: true, valueType: 'boolean', order: 2, isFeatured: true, isFilterable: true },
      { key: 'battery', label: 'Batería', value: 8, valueType: 'number', unit: 'hs', order: 3, isFeatured: false, isFilterable: false },
    ],
  },

  // ZAPATILLAS
  {
    name: 'Zapatillas Running Pro',
    slug: 'zapatillas-running-pro',
    description: 'Zapatillas profesionales para running. Suela con tecnología de amortiguación avanzada. Upper transpirable. Perfectas para largas distancias.',
    shortDescription: 'Zapatillas profesionales para correr',
    price: 32000,
    compareAtPrice: 40000,
    stock: 30,
    sku: 'ZAP-RUN-PRO-001',
    categorySlug: 'zapatillas',
    trackInventory: true,
    weight: 0.6,
    isActive: true,
    isFeatured: true,
    tags: ['zapatillas', 'running', 'deportivo', 'profesional'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        altText: 'Zapatillas running pro',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Negro/Rojo', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['38', '39', '40', '41', '42', '43', '44'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: 'Mesh transpirable', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'cushioning', label: 'Amortiguación', value: 'Alta', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'gender', label: 'Género', value: 'Unisex', valueType: 'text', order: 4, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Zapatillas Urbanas Blancas',
    slug: 'zapatillas-urbanas-blancas',
    description: 'Zapatillas urbanas de estilo casual. Diseño minimalista que combina con todo. Suela cómoda para uso diario. Material de alta calidad.',
    shortDescription: 'Zapatillas urbanas casuales',
    price: 25000,
    stock: 42,
    sku: 'ZAP-URB-BLA-002',
    categorySlug: 'zapatillas',
    trackInventory: true,
    weight: 0.55,
    isActive: true,
    isFeatured: false,
    tags: ['zapatillas', 'urbanas', 'casual', 'blanco'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
        altText: 'Zapatillas urbanas blancas',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Blanco', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['36', '37', '38', '39', '40', '41', '42'], valueType: 'array', order: 1, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: 'Cuero sintético', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'style', label: 'Estilo', value: 'Urbano/Casual', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
    ],
  },

  // DECORACIÓN
  {
    name: 'Lámpara de Mesa Moderna',
    slug: 'lampara-de-mesa-moderna',
    description: 'Lámpara de mesa con diseño contemporáneo. Luz LED regulable en intensidad. Base de metal con acabado mate. Perfecta para escritorio o mesa de luz.',
    shortDescription: 'Lámpara LED regulable moderna',
    price: 18000,
    stock: 20,
    sku: 'DEC-LAM-MES-001',
    categorySlug: 'decoracion',
    trackInventory: true,
    weight: 1.2,
    isActive: true,
    isFeatured: false,
    tags: ['lampara', 'decoracion', 'led', 'moderno', 'hogar'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        altText: 'Lámpara de mesa moderna',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'color', label: 'Color', value: 'Negro Mate', valueType: 'color', order: 0, isFeatured: true, isFilterable: true },
      { key: 'lightType', label: 'Tipo de luz', value: 'LED', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'dimmable', label: 'Regulable', value: true, valueType: 'boolean', order: 2, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: 'Metal', valueType: 'text', order: 3, isFeatured: false, isFilterable: true },
      { key: 'height', label: 'Altura', value: 45, valueType: 'number', unit: 'cm', order: 4, isFeatured: false, isFilterable: false },
    ],
  },
];

async function seedProducts() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Limpiar colecciones
    console.log('🗑️  Limpiando productos, categorías, imágenes y características...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await ProductImage.deleteMany({});
    await ProductCharacteristic.deleteMany({});
    console.log('✅ Colecciones limpiadas\n');

    // Crear categorías
    console.log('📁 Creando categorías...');
    const createdCategories = {};

    // Primero crear categorías padre
    for (const catData of categories.filter(c => !c.parentSlug)) {
      const category = await Category.create({
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        isActive: catData.isActive,
        order: catData.order,
      });
      createdCategories[category.slug] = category;
      console.log(`   ✓ ${category.name}`);
    }

    // Luego crear categorías hijas
    for (const catData of categories.filter(c => c.parentSlug)) {
      const parent = createdCategories[catData.parentSlug];
      const category = await Category.create({
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        parent: parent._id,
        isActive: catData.isActive,
        order: catData.order,
      });
      createdCategories[category.slug] = category;
      console.log(`   ✓   ↳ ${category.name}`);
    }

    console.log(`\n✅ ${Object.keys(createdCategories).length} categorías creadas\n`);

    // Crear productos
    console.log('🛍️  Creando productos...');
    let totalProducts = 0;
    let totalImages = 0;
    let totalCharacteristics = 0;

    for (const prodData of products) {
      const category = createdCategories[prodData.categorySlug];
      if (!category) {
        console.log(`   ⚠️  Categoría no encontrada para ${prodData.name}`);
        continue;
      }

      // Crear producto
      const product = await Product.create({
        name: prodData.name,
        slug: prodData.slug,
        description: prodData.description,
        shortDescription: prodData.shortDescription,
        price: prodData.price,
        compareAtPrice: prodData.compareAtPrice,
        stock: prodData.stock,
        sku: prodData.sku,
        category: category._id,
        trackInventory: prodData.trackInventory,
        weight: prodData.weight,
        dimensions: prodData.dimensions,
        isActive: prodData.isActive,
        isFeatured: prodData.isFeatured,
        tags: prodData.tags,
      });

      totalProducts++;
      console.log(`   ✓ ${product.name} (${category.name})`);

      // Crear imágenes
      for (const imgData of prodData.images) {
        await ProductImage.create({
          product: product._id,
          url: imgData.url,
          storagePath: `products/${product.slug}/${imgData.order}.jpg`,
          altText: imgData.altText,
          isPrimary: imgData.isPrimary,
          order: imgData.order,
        });
        totalImages++;
      }

      // Crear características
      for (const charData of prodData.characteristics) {
        await ProductCharacteristic.create({
          product: product._id,
          key: charData.key,
          label: charData.label,
          value: charData.value,
          valueType: charData.valueType,
          unit: charData.unit,
          order: charData.order,
          isFeatured: charData.isFeatured,
          isFilterable: charData.isFilterable,
        });
        totalCharacteristics++;
      }
    }

    console.log(`\n✅ ${totalProducts} productos creados`);
    console.log(`✅ ${totalImages} imágenes creadas`);
    console.log(`✅ ${totalCharacteristics} características creadas\n`);

    // Resumen
    console.log('📊 RESUMEN:');
    console.log('═══════════════════════════════════════════');
    console.log(`   Categorías:       ${Object.keys(createdCategories).length}`);
    console.log(`   Productos:        ${totalProducts}`);
    console.log(`   Imágenes:         ${totalImages}`);
    console.log(`   Características:  ${totalCharacteristics}`);
    console.log('═══════════════════════════════════════════\n');

    console.log('📦 PRODUCTOS POR CATEGORÍA:');
    console.log('═══════════════════════════════════════════');
    for (const [slug, category] of Object.entries(createdCategories)) {
      const count = await Product.countDocuments({ category: category._id });
      if (count > 0) {
        console.log(`   ${category.name}: ${count} productos`);
      }
    }
    console.log('═══════════════════════════════════════════\n');

    console.log('✨ Seeder completado exitosamente!\n');
  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar seeder
seedProducts();
