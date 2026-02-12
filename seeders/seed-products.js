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

// Categorías jerárquicas para tienda anime
const categories = [
  // Figuras
  {
    name: 'Figuras',
    description: 'Figuras coleccionables de anime y manga',
    slug: 'figuras',
    parent: null,
    isActive: true,
    order: 1,
  },
  {
    name: 'Nendoroid',
    description: 'Figuras Nendoroid super deformadas',
    slug: 'nendoroid',
    parentSlug: 'figuras',
    isActive: true,
    order: 1,
  },
  {
    name: 'Scale Figures',
    description: 'Figuras a escala de alta calidad',
    slug: 'scale',
    parentSlug: 'figuras',
    isActive: true,
    order: 2,
  },
  {
    name: 'Pop Up Parade',
    description: 'Figuras Pop Up Parade accesibles',
    slug: 'popup',
    parentSlug: 'figuras',
    isActive: true,
    order: 3,
  },
  {
    name: 'Figma',
    description: 'Figuras articuladas Figma',
    slug: 'figma',
    parentSlug: 'figuras',
    isActive: true,
    order: 4,
  },

  // Manga
  {
    name: 'Manga',
    description: 'Manga y novelas ligeras',
    slug: 'manga',
    parent: null,
    isActive: true,
    order: 2,
  },
  {
    name: 'Shonen',
    description: 'Manga shonen de acción',
    slug: 'shonen',
    parentSlug: 'manga',
    isActive: true,
    order: 1,
  },
  {
    name: 'Seinen',
    description: 'Manga seinen maduro',
    slug: 'seinen',
    parentSlug: 'manga',
    isActive: true,
    order: 2,
  },
  {
    name: 'Shojo',
    description: 'Manga shojo romántico',
    slug: 'shojo',
    parentSlug: 'manga',
    isActive: true,
    order: 3,
  },
  {
    name: 'Light Novels',
    description: 'Novelas ligeras japonesas',
    slug: 'light-novels',
    parentSlug: 'manga',
    isActive: true,
    order: 4,
  },

  // Ropa
  {
    name: 'Ropa',
    description: 'Ropa y accesorios de anime',
    slug: 'ropa',
    parent: null,
    isActive: true,
    order: 3,
  },
  {
    name: 'Camisetas',
    description: 'Camisetas con diseños de anime',
    slug: 'camisetas',
    parentSlug: 'ropa',
    isActive: true,
    order: 1,
  },
  {
    name: 'Hoodies',
    description: 'Sudaderas con capucha de anime',
    slug: 'hoodies',
    parentSlug: 'ropa',
    isActive: true,
    order: 2,
  },
  {
    name: 'Cosplay',
    description: 'Trajes y accesorios de cosplay',
    slug: 'cosplay',
    parentSlug: 'ropa',
    isActive: true,
    order: 3,
  },

  // Comida Japonesa
  {
    name: 'Comida',
    description: 'Comida y bebidas japonesas',
    slug: 'comida',
    parent: null,
    isActive: true,
    order: 4,
  },
  {
    name: 'Ramen',
    description: 'Ramen instantáneo y kits',
    slug: 'ramen',
    parentSlug: 'comida',
    isActive: true,
    order: 1,
  },
  {
    name: 'Snacks',
    description: 'Dulces y snacks japoneses',
    slug: 'snacks',
    parentSlug: 'comida',
    isActive: true,
    order: 2,
  },
  {
    name: 'Bebidas',
    description: 'Bebidas japonesas',
    slug: 'bebidas',
    parentSlug: 'comida',
    isActive: true,
    order: 3,
  },
  {
    name: 'Té',
    description: 'Té japonés tradicional',
    slug: 'te',
    parentSlug: 'comida',
    isActive: true,
    order: 4,
  },

  // Accesorios
  {
    name: 'Accesorios',
    description: 'Accesorios y coleccionables',
    slug: 'accesorios',
    parent: null,
    isActive: true,
    order: 5,
  },
  {
    name: 'Llaveros',
    description: 'Llaveros de anime',
    slug: 'llaveros',
    parentSlug: 'accesorios',
    isActive: true,
    order: 1,
  },
  {
    name: 'Posters',
    description: 'Posters y wall scrolls',
    slug: 'posters',
    parentSlug: 'accesorios',
    isActive: true,
    order: 2,
  },
  {
    name: 'Peluches',
    description: 'Peluches de personajes anime',
    slug: 'peluches',
    parentSlug: 'accesorios',
    isActive: true,
    order: 3,
  },
];

// Productos de tienda anime
const products = [
  // ============ NENDOROIDS ============
  {
    name: 'Nendoroid Satoru Gojo',
    slug: 'nendoroid-satoru-gojo',
    description: 'Nendoroid del poderoso hechicero Satoru Gojo de Jujutsu Kaisen. Incluye 3 expresiones faciales intercambiables, manos intercambiables, técnica de Infinito, técnica Purple Hollow y accesorios especiales. Totalmente articulado y pintado.',
    shortDescription: 'Nendoroid de Gojo de Jujutsu Kaisen',
    price: 28500,
    compareAtPrice: 35000,
    stock: 15,
    sku: 'NEND-JJK-GOJO-001',
    categorySlug: 'nendoroid',
    trackInventory: true,
    weight: 0.3,
    dimensions: { length: 10, width: 10, height: 10, unit: 'cm' },
    isActive: true,
    isFeatured: true,
    tags: ['nendoroid', 'jujutsu-kaisen', 'gojo', 'figura', 'coleccionable'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
        altText: 'Nendoroid Satoru Gojo',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Jujutsu Kaisen', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'character', label: 'Personaje', value: 'Satoru Gojo', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'manufacturer', label: 'Fabricante', value: 'Good Smile Company', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'height', label: 'Altura', value: 10, valueType: 'number', unit: 'cm', order: 3, isFeatured: true, isFilterable: false },
      { key: 'articulated', label: 'Articulado', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
      { key: 'includes', label: 'Incluye', value: ['3 expresiones', 'Manos intercambiables', 'Efectos especiales'], valueType: 'array', order: 5, isFeatured: false, isFilterable: false },
    ],
  },
  {
    name: 'Nendoroid Nezuko Kamado',
    slug: 'nendoroid-nezuko-kamado',
    description: 'Adorable Nendoroid de Nezuko Kamado de Demon Slayer. Viene con su característico bambú, expresiones intercambiables incluyendo su forma demonio, y efectos de llamas rosas. Perfecta para recrear escenas icónicas.',
    shortDescription: 'Nendoroid de Nezuko de Demon Slayer',
    price: 27000,
    compareAtPrice: 33000,
    stock: 20,
    sku: 'NEND-DS-NEZUKO-002',
    categorySlug: 'nendoroid',
    trackInventory: true,
    weight: 0.3,
    isActive: true,
    isFeatured: true,
    tags: ['nendoroid', 'demon-slayer', 'nezuko', 'figura'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800',
        altText: 'Nendoroid Nezuko Kamado',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Demon Slayer', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'character', label: 'Personaje', value: 'Nezuko Kamado', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'manufacturer', label: 'Fabricante', value: 'Good Smile Company', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'height', label: 'Altura', value: 10, valueType: 'number', unit: 'cm', order: 3, isFeatured: true, isFilterable: false },
      { key: 'articulated', label: 'Articulado', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
    ],
  },

  // ============ SCALE FIGURES ============
  {
    name: 'Miku Hatsune 1/7 Scale Figure',
    slug: 'miku-hatsune-scale-figure',
    description: 'Impresionante figura a escala 1/7 de Hatsune Miku en pose dinámica. Escultura detallada con cabello translúcido, base elaborada con efectos de luz LED. Edición limitada de alta calidad para coleccionistas serios.',
    shortDescription: 'Figura escala 1/7 de Miku Hatsune',
    price: 85000,
    compareAtPrice: 110000,
    stock: 8,
    sku: 'SCALE-VOCA-MIKU-001',
    categorySlug: 'scale',
    trackInventory: true,
    weight: 1.2,
    dimensions: { length: 20, width: 20, height: 25, unit: 'cm' },
    isActive: true,
    isFeatured: true,
    tags: ['scale-figure', 'miku', 'vocaloid', '1/7', 'figura-premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800',
        altText: 'Miku Hatsune Scale Figure',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Vocaloid', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'character', label: 'Personaje', value: 'Hatsune Miku', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'scale', label: 'Escala', value: '1/7', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'height', label: 'Altura', value: 24, valueType: 'number', unit: 'cm', order: 3, isFeatured: true, isFilterable: false },
      { key: 'manufacturer', label: 'Fabricante', value: 'Good Smile Company', valueType: 'text', order: 4, isFeatured: false, isFilterable: true },
      { key: 'limited', label: 'Edición limitada', value: true, valueType: 'boolean', order: 5, isFeatured: true, isFilterable: true },
      { key: 'led', label: 'Incluye LED', value: true, valueType: 'boolean', order: 6, isFeatured: true, isFilterable: true },
    ],
  },
  {
    name: 'Rem Re:Zero 1/8 Scale Figure',
    slug: 'rem-rezero-scale-figure',
    description: 'Hermosa figura de Rem de Re:Zero en escala 1/8. Vestida con su uniforme de sirvienta, pose elegante y expresión dulce. Acabado de pintura de alta calidad con detalles impecables.',
    shortDescription: 'Figura escala 1/8 de Rem',
    price: 72000,
    compareAtPrice: 90000,
    stock: 12,
    sku: 'SCALE-REZ-REM-002',
    categorySlug: 'scale',
    trackInventory: true,
    weight: 1.0,
    isActive: true,
    isFeatured: true,
    tags: ['scale-figure', 'rem', 'rezero', '1/8', 'waifu'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580507389845-0c92e1badc5f?w=800',
        altText: 'Rem Re:Zero Scale Figure',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Re:Zero', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'character', label: 'Personaje', value: 'Rem', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'scale', label: 'Escala', value: '1/8', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'height', label: 'Altura', value: 20, valueType: 'number', unit: 'cm', order: 3, isFeatured: true, isFilterable: false },
      { key: 'manufacturer', label: 'Fabricante', value: 'Kadokawa', valueType: 'text', order: 4, isFeatured: false, isFilterable: true },
    ],
  },

  // ============ MANGA ============
  {
    name: 'Chainsaw Man Vol. 1-12 Box Set',
    slug: 'chainsaw-man-box-set',
    description: 'Box set completo de Chainsaw Man volúmenes 1 al 12. Incluye los primeros 12 tomos de la revolucionaria serie de Tatsuki Fujimoto. Viene en caja coleccionable con ilustración exclusiva.',
    shortDescription: 'Box set completo Chainsaw Man',
    price: 42000,
    compareAtPrice: 55000,
    stock: 25,
    sku: 'MANGA-SHON-CSM-001',
    categorySlug: 'shonen',
    trackInventory: true,
    weight: 2.5,
    isActive: true,
    isFeatured: true,
    tags: ['manga', 'chainsaw-man', 'shonen', 'box-set', 'coleccion'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800',
        altText: 'Chainsaw Man Box Set',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'genre', label: 'Género', value: 'Shonen', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'author', label: 'Autor', value: 'Tatsuki Fujimoto', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'volumes', label: 'Volúmenes incluidos', value: 12, valueType: 'number', order: 2, isFeatured: true, isFilterable: false },
      { key: 'language', label: 'Idioma', value: 'Español', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'publisher', label: 'Editorial', value: 'Panini Manga', valueType: 'text', order: 4, isFeatured: false, isFilterable: true },
      { key: 'complete', label: 'Serie completa', value: false, valueType: 'boolean', order: 5, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Berserk Deluxe Edition Vol. 1',
    slug: 'berserk-deluxe-edition-vol1',
    description: 'Edición deluxe de Berserk, la obra maestra de Kentaro Miura. Formato grande con tapa dura, papel de alta calidad e ilustraciones a color. Incluye los primeros 3 volúmenes de la serie.',
    shortDescription: 'Berserk edición deluxe',
    price: 18500,
    compareAtPrice: 23000,
    stock: 18,
    sku: 'MANGA-SEIN-BERSERK-002',
    categorySlug: 'seinen',
    trackInventory: true,
    weight: 1.8,
    isActive: true,
    isFeatured: true,
    tags: ['manga', 'berserk', 'seinen', 'deluxe', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=800',
        altText: 'Berserk Deluxe Edition',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'genre', label: 'Género', value: 'Seinen', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'author', label: 'Autor', value: 'Kentaro Miura', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'volumes', label: 'Volúmenes incluidos', value: 3, valueType: 'number', order: 2, isFeatured: true, isFilterable: false },
      { key: 'language', label: 'Idioma', value: 'Español', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'format', label: 'Formato', value: 'Tapa dura deluxe', valueType: 'text', order: 4, isFeatured: true, isFilterable: true },
      { key: 'color', label: 'Páginas a color', value: true, valueType: 'boolean', order: 5, isFeatured: true, isFilterable: true },
    ],
  },
  {
    name: 'Kaguya-sama: Love is War Vol. 1',
    slug: 'kaguya-sama-vol1',
    description: 'Primer volumen de la hilarante comedia romántica Kaguya-sama. La batalla de ingenio entre dos genios que no quieren confesar su amor. Perfecto para fans del romance y la comedia.',
    shortDescription: 'Kaguya-sama Vol. 1',
    price: 3200,
    stock: 45,
    sku: 'MANGA-SHOJO-KAGUYA-003',
    categorySlug: 'shojo',
    trackInventory: true,
    weight: 0.25,
    isActive: true,
    isFeatured: false,
    tags: ['manga', 'kaguya-sama', 'shojo', 'romance', 'comedia'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=800',
        altText: 'Kaguya-sama Vol. 1',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'genre', label: 'Género', value: 'Shojo/Seinen', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'author', label: 'Autor', value: 'Aka Akasaka', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'language', label: 'Idioma', value: 'Español', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'pages', label: 'Páginas', value: 192, valueType: 'number', order: 3, isFeatured: false, isFilterable: false },
    ],
  },

  // ============ ROPA ============
  {
    name: 'Camiseta Attack on Titan Survey Corps',
    slug: 'camiseta-aot-survey-corps',
    description: 'Camiseta oficial de Attack on Titan con el emblema del Cuerpo de Exploración. 100% algodón de alta calidad, estampado resistente al lavado. Diseño detallado en el frente y espalda.',
    shortDescription: 'Remera oficial de Attack on Titan',
    price: 7500,
    compareAtPrice: 10000,
    stock: 60,
    sku: 'ROPA-CAM-AOT-001',
    categorySlug: 'camisetas',
    trackInventory: true,
    weight: 0.2,
    isActive: true,
    isFeatured: true,
    tags: ['camiseta', 'attack-on-titan', 'anime', 'ropa', 'survey-corps'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
        altText: 'Camiseta Attack on Titan',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Attack on Titan', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '100% Algodón', valueType: 'text', order: 1, isFeatured: false, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['S', 'M', 'L', 'XL', 'XXL'], valueType: 'array', order: 2, isFeatured: true, isFilterable: true },
      { key: 'color', label: 'Color', value: 'Negro', valueType: 'color', order: 3, isFeatured: true, isFilterable: true },
      { key: 'official', label: 'Producto oficial', value: true, valueType: 'boolean', order: 4, isFeatured: true, isFilterable: true },
    ],
  },
  {
    name: 'Hoodie Naruto Akatsuki',
    slug: 'hoodie-naruto-akatsuki',
    description: 'Sudadera con capucha inspirada en el uniforme de la organización Akatsuki. Estampado de nubes rojas en todo el hoodie. Interior forrado, muy cómodo y abrigado. Perfecto para el invierno.',
    shortDescription: 'Hoodie de Akatsuki de Naruto',
    price: 22000,
    compareAtPrice: 28000,
    stock: 35,
    sku: 'ROPA-HOO-NAR-002',
    categorySlug: 'hoodies',
    trackInventory: true,
    weight: 0.8,
    isActive: true,
    isFeatured: true,
    tags: ['hoodie', 'naruto', 'akatsuki', 'sudadera', 'anime'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        altText: 'Hoodie Naruto Akatsuki',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Naruto', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: '80% Algodón, 20% Poliéster', valueType: 'text', order: 1, isFeatured: false, isFilterable: true },
      { key: 'sizes', label: 'Tallas disponibles', value: ['S', 'M', 'L', 'XL', 'XXL'], valueType: 'array', order: 2, isFeatured: true, isFilterable: true },
      { key: 'color', label: 'Color', value: 'Negro con nubes rojas', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'hasHood', label: 'Con capucha', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
    ],
  },

  // ============ RAMEN ============
  {
    name: 'Ramen Tonkotsu Premium Pack x6',
    slug: 'ramen-tonkotsu-premium-pack',
    description: 'Pack de 6 ramen instantáneos Tonkotsu de alta calidad importados de Japón. Caldo cremoso de huesos de cerdo, fideos auténticos y sobre de condimentos. Listo en 3 minutos.',
    shortDescription: 'Pack 6 ramen Tonkotsu japonés',
    price: 8500,
    compareAtPrice: 11000,
    stock: 50,
    sku: 'COMIDA-RAM-TONK-001',
    categorySlug: 'ramen',
    trackInventory: true,
    weight: 0.6,
    isActive: true,
    isFeatured: true,
    tags: ['ramen', 'tonkotsu', 'comida-japonesa', 'instant', 'importado'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        altText: 'Ramen Tonkotsu Pack',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'type', label: 'Tipo', value: 'Tonkotsu', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'quantity', label: 'Cantidad', value: 6, valueType: 'number', unit: 'unidades', order: 1, isFeatured: true, isFilterable: false },
      { key: 'spicy', label: 'Picante', value: false, valueType: 'boolean', order: 2, isFeatured: true, isFilterable: true },
      { key: 'origin', label: 'Origen', value: 'Japón', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'cookTime', label: 'Tiempo de cocción', value: 3, valueType: 'number', unit: 'min', order: 4, isFeatured: false, isFilterable: false },
      { key: 'halal', label: 'Halal', value: false, valueType: 'boolean', order: 5, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Ramen Picante Coreano Buldak x5',
    slug: 'ramen-buldak-picante',
    description: 'El famoso ramen coreano súper picante Buldak. Pack de 5 unidades del desafío de fuego. Para los amantes del picante extremo. Incluye salsa especial ultra picante.',
    shortDescription: 'Ramen picante Buldak coreano',
    price: 7200,
    stock: 40,
    sku: 'COMIDA-RAM-BULD-002',
    categorySlug: 'ramen',
    trackInventory: true,
    weight: 0.7,
    isActive: true,
    isFeatured: true,
    tags: ['ramen', 'buldak', 'picante', 'coreano', 'challenge'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800',
        altText: 'Ramen Buldak Picante',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'type', label: 'Tipo', value: 'Buldak (Pollo picante)', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'quantity', label: 'Cantidad', value: 5, valueType: 'number', unit: 'unidades', order: 1, isFeatured: true, isFilterable: false },
      { key: 'spicy', label: 'Nivel picante', value: 'Extremo', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'origin', label: 'Origen', value: 'Corea del Sur', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'scoville', label: 'Scoville', value: 8808, valueType: 'number', unit: 'SHU', order: 4, isFeatured: true, isFilterable: false },
    ],
  },

  // ============ SNACKS ============
  {
    name: 'Pocky Chocolate x10 Packs',
    slug: 'pocky-chocolate-pack',
    description: 'Pack de 10 cajas de Pocky sabor chocolate clásico. El snack japonés más icónico. Palitos de galleta cubiertos con chocolate. Perfectos para compartir o coleccionar.',
    shortDescription: 'Pack 10 Pocky chocolate',
    price: 4500,
    stock: 80,
    sku: 'COMIDA-SNK-POCKY-001',
    categorySlug: 'snacks',
    trackInventory: true,
    weight: 0.45,
    isActive: true,
    isFeatured: false,
    tags: ['pocky', 'snack', 'chocolate', 'japones', 'dulce'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800',
        altText: 'Pocky Chocolate',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'brand', label: 'Marca', value: 'Pocky', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'flavor', label: 'Sabor', value: 'Chocolate', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'quantity', label: 'Cantidad', value: 10, valueType: 'number', unit: 'cajas', order: 2, isFeatured: true, isFilterable: false },
      { key: 'origin', label: 'Origen', value: 'Japón', valueType: 'text', order: 3, isFeatured: false, isFilterable: true },
      { key: 'vegetarian', label: 'Vegetariano', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Kit Kat Matcha Green Tea Edition',
    slug: 'kitkat-matcha-edition',
    description: 'Kit Kat edición especial sabor té verde matcha japonés. Importado directamente de Japón. Sabor auténtico y único que solo encontrarás en Japón. Perfecto para regalar.',
    shortDescription: 'Kit Kat matcha japonés',
    price: 3800,
    compareAtPrice: 5000,
    stock: 55,
    sku: 'COMIDA-SNK-KITKAT-002',
    categorySlug: 'snacks',
    trackInventory: true,
    weight: 0.15,
    isActive: true,
    isFeatured: true,
    tags: ['kitkat', 'matcha', 'te-verde', 'snack', 'edicion-especial'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606312619070-d48b4f0c1f85?w=800',
        altText: 'Kit Kat Matcha',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'brand', label: 'Marca', value: 'Kit Kat', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'flavor', label: 'Sabor', value: 'Matcha Green Tea', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'origin', label: 'Origen', value: 'Japón', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'limited', label: 'Edición limitada', value: true, valueType: 'boolean', order: 3, isFeatured: true, isFilterable: true },
    ],
  },

  // ============ BEBIDAS ============
  {
    name: 'Ramune Soda Original x6',
    slug: 'ramune-soda-original-pack',
    description: 'Pack de 6 botellas de Ramune, la famosa soda japonesa con canica. Sabor original refrescante. Botella de vidrio tradicional con cierre único. Experiencia auténtica japonesa.',
    shortDescription: 'Pack 6 Ramune soda japonesa',
    price: 5400,
    stock: 65,
    sku: 'COMIDA-BEB-RAMUNE-001',
    categorySlug: 'bebidas',
    trackInventory: true,
    weight: 1.5,
    isActive: true,
    isFeatured: true,
    tags: ['ramune', 'soda', 'bebida', 'japonesa', 'refresco'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
        altText: 'Ramune Soda',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'brand', label: 'Marca', value: 'Ramune', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'flavor', label: 'Sabor', value: 'Original', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'quantity', label: 'Cantidad', value: 6, valueType: 'number', unit: 'botellas', order: 2, isFeatured: true, isFilterable: false },
      { key: 'volume', label: 'Volumen', value: 200, valueType: 'number', unit: 'ml', order: 3, isFeatured: false, isFilterable: false },
      { key: 'carbonated', label: 'Gasificada', value: true, valueType: 'boolean', order: 4, isFeatured: false, isFilterable: true },
    ],
  },

  // ============ TÉ ============
  {
    name: 'Matcha Ceremonial Premium 50g',
    slug: 'matcha-ceremonial-premium',
    description: 'Té matcha ceremonial de la más alta calidad de Uji, Japón. Polvo finísimo color verde brillante. Sabor umami intenso y cremoso. Para ceremonia del té tradicional o lattes.',
    shortDescription: 'Matcha ceremonial japonés premium',
    price: 12500,
    compareAtPrice: 16000,
    stock: 30,
    sku: 'COMIDA-TE-MATCHA-001',
    categorySlug: 'te',
    trackInventory: true,
    weight: 0.05,
    isActive: true,
    isFeatured: true,
    tags: ['matcha', 'te', 'ceremonial', 'premium', 'japones'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563822249366-3efdbf25fbc8?w=800',
        altText: 'Matcha Ceremonial',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'type', label: 'Tipo', value: 'Matcha Ceremonial', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'weight', label: 'Peso neto', value: 50, valueType: 'number', unit: 'g', order: 1, isFeatured: true, isFilterable: false },
      { key: 'origin', label: 'Origen', value: 'Uji, Japón', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'grade', label: 'Grado', value: 'Ceremonial', valueType: 'text', order: 3, isFeatured: true, isFilterable: true },
      { key: 'organic', label: 'Orgánico', value: true, valueType: 'boolean', order: 4, isFeatured: true, isFilterable: true },
    ],
  },

  // ============ ACCESORIOS ============
  {
    name: 'Llavero Acrílico Spy x Family Set',
    slug: 'llavero-spy-family-set',
    description: 'Set de 3 llaveros acrílicos de Spy x Family: Anya, Loid y Yor. Acrílico de doble cara con impresión de alta calidad. Llavero metálico resistente. Perfecto para fans de la serie.',
    shortDescription: 'Set 3 llaveros Spy x Family',
    price: 2800,
    stock: 100,
    sku: 'ACC-KEY-SPY-001',
    categorySlug: 'llaveros',
    trackInventory: true,
    weight: 0.05,
    isActive: true,
    isFeatured: false,
    tags: ['llavero', 'spy-family', 'acrilico', 'accesorio', 'set'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590422749897-dfd1c4707a96?w=800',
        altText: 'Llaveros Spy x Family',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Spy x Family', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'quantity', label: 'Cantidad', value: 3, valueType: 'number', unit: 'piezas', order: 1, isFeatured: true, isFilterable: false },
      { key: 'material', label: 'Material', value: 'Acrílico', valueType: 'text', order: 2, isFeatured: false, isFilterable: true },
      { key: 'doubleSided', label: 'Doble cara', value: true, valueType: 'boolean', order: 3, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Poster One Piece Wanted Luffy',
    slug: 'poster-one-piece-luffy-wanted',
    description: 'Poster estilo "Se busca" de Monkey D. Luffy después del arco de Wano. Impresión de alta calidad en papel grueso. Tamaño A2 (42x59cm). Perfecto para decorar tu habitación otaku.',
    shortDescription: 'Poster wanted de Luffy',
    price: 1800,
    stock: 75,
    sku: 'ACC-POS-OP-001',
    categorySlug: 'posters',
    trackInventory: true,
    weight: 0.1,
    isActive: true,
    isFeatured: false,
    tags: ['poster', 'one-piece', 'luffy', 'wanted', 'decoracion'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        altText: 'Poster Luffy Wanted',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'One Piece', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'character', label: 'Personaje', value: 'Monkey D. Luffy', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'size', label: 'Tamaño', value: 'A2 (42x59cm)', valueType: 'text', order: 2, isFeatured: true, isFilterable: true },
      { key: 'material', label: 'Material', value: 'Papel grueso', valueType: 'text', order: 3, isFeatured: false, isFilterable: true },
    ],
  },
  {
    name: 'Peluche Pikachu 30cm',
    slug: 'peluche-pikachu-30cm',
    description: 'Peluche oficial de Pikachu de 30cm de alto. Súper suave y abrazable. Detalles bordados de alta calidad. Perfecto para coleccionar o regalar. Producto oficial de Pokémon Center.',
    shortDescription: 'Peluche oficial Pikachu 30cm',
    price: 15000,
    compareAtPrice: 20000,
    stock: 40,
    sku: 'ACC-PLU-PIKA-001',
    categorySlug: 'peluches',
    trackInventory: true,
    weight: 0.4,
    isActive: true,
    isFeatured: true,
    tags: ['peluche', 'pikachu', 'pokemon', 'oficial', 'coleccionable'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1614963366795-1c788e18a7b9?w=800',
        altText: 'Peluche Pikachu',
        isPrimary: true,
        order: 0,
      },
    ],
    characteristics: [
      { key: 'series', label: 'Serie', value: 'Pokémon', valueType: 'text', order: 0, isFeatured: true, isFilterable: true },
      { key: 'character', label: 'Personaje', value: 'Pikachu', valueType: 'text', order: 1, isFeatured: true, isFilterable: true },
      { key: 'height', label: 'Altura', value: 30, valueType: 'number', unit: 'cm', order: 2, isFeatured: true, isFilterable: false },
      { key: 'material', label: 'Material', value: 'Poliéster suave', valueType: 'text', order: 3, isFeatured: false, isFilterable: true },
      { key: 'official', label: 'Producto oficial', value: true, valueType: 'boolean', order: 4, isFeatured: true, isFilterable: true },
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
    console.log('📊 RESUMEN DE LA TIENDA ANIME:');
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

    console.log('✨ ¡Tienda anime lista para vender! 🎌\n');
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