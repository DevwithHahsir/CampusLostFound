import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Campus Lost Found",
  description = "Find and report lost items across Pakistani universities and campuses",
  keywords = "lost items, found items, campus, university, Pakistan, students",
  image = "/src/assets/logo.png",
  url = window.location.href,
  type = "website",
  siteName = "Campus Lost Found",
  author = "Campus Lost Found Team",
  links = [],
  customMeta = [],
}) => {
  // Default keywords if not provided
  const defaultKeywords = [
    "lost and found",
    "campus lost items",
    "university lost property",
    "student services",
    "Pakistan universities",
    "lost belongings",
    "found items",
    "campus community",
  ];

  // Combine provided keywords with defaults
  const allKeywords =
    typeof keywords === "string"
      ? keywords
      : [...defaultKeywords, ...(Array.isArray(keywords) ? keywords : [])].join(
          ", "
        );

  // Default structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: description,
    url: url,
    author: {
      "@type": "Organization",
      name: author,
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/src/assets/logo.png" />
      <link rel="apple-touch-icon" href="/src/assets/logo.png" />

      {/* Custom Links */}
      {links && links.map((link, index) => <link key={index} {...link} />)}

      {/* Custom Meta Tags */}
      {customMeta &&
        customMeta.map((meta, index) => <meta key={index} {...meta} />)}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
