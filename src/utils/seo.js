/**
 * Generar meta tags dinámicos
 */
export function generateMetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
}) {
  const siteName = 'Mi E-Commerce';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ejemplo.com';

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      type,
      url: `${baseUrl}${url}`,
      title,
      description,
      images: image ? [{ url: image }] : [],
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Generar structured data (JSON-LD) para producto
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0]?.url,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Mi E-Commerce',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ARS',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}
