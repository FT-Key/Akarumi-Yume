import Head from 'next/head';

export default function SEO({ title, description, image, url }) {
  const siteName = 'Mi E-Commerce';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ejemplo.com';

  return (
    <Head>
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${baseUrl}${url}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
