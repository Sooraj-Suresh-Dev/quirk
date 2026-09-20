import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
}

export function PageMeta({
  title,
  description,
  ogImage = '/og-default.png',
  ogType = 'website',
  canonicalPath,
}: PageMetaProps) {
  const fullTitle = `${title} | Quirk`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://quirk-web-one.vercel.app';
  const url = canonicalPath
    ? `${origin}${canonicalPath}`
    : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {url && (
        <>
          <link rel="canonical" href={url} />
          <meta property="og:url" content={url} />
        </>
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
