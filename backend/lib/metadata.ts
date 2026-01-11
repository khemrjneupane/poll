// lib/metadata.ts
import { Metadata } from "next";
import { SITE_CONFIG } from "./site-config";

interface MetadataParams {
  title: string;
  description?: string;
  path: string;
  ogImage?: string | null;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  // Fix: Make these optional and properly typed
  customOpenGraph?: Partial<Metadata["openGraph"]>;
  customTwitter?: Partial<Metadata["twitter"]>;
}

export function generateMetadatas({
  title,
  description = SITE_CONFIG.defaultDescription,
  path,
  ogImage = SITE_CONFIG.defaultOgImage,
  keywords = [],
  noIndex = false,
  type = "website",
  publishedTime,
  customOpenGraph,
  customTwitter,
}: MetadataParams): Metadata {
  const fullUrl = `${SITE_CONFIG.url}${path}`;
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  // Build images array safely
  const openGraphImages = [];

  if (ogImage !== null) {
    openGraphImages.push({
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    });
  }

  // Handle customOpenGraph.images safely
  if (customOpenGraph?.images) {
    const customImages = Array.isArray(customOpenGraph.images)
      ? customOpenGraph.images
      : [customOpenGraph.images];

    openGraphImages.push(...customImages);
  }

  // Build openGraph object
  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title: fullTitle,
    description,
    url: fullUrl,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type,
    ...(publishedTime && { publishedTime }),
    ...(openGraphImages.length > 0 && { images: openGraphImages }),
    ...customOpenGraph,
  };

  // Remove images from customOpenGraph to avoid duplication
  if (customOpenGraph?.images) {
    const { images, ...cleanCustomOpenGraph } = customOpenGraph;
    Object.assign(openGraph, cleanCustomOpenGraph);
  }

  // Build twitter card safely
  const twitterImages = ogImage !== null ? [ogImage] : undefined;

  const twitterCard: Metadata["twitter"] = {
    card: "summary_large_image",
    title: fullTitle,
    description,
    ...(twitterImages && { images: twitterImages }),
    ...(SITE_CONFIG.twitterHandle && { creator: SITE_CONFIG.twitterHandle }),
    ...customTwitter,
  };

  return {
    title: fullTitle,
    description,
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    robots: noIndex ? "noindex, nofollow" : "index, follow",

    openGraph,
    twitter: twitterCard,

    alternates: {
      canonical: fullUrl,
    },

    authors: [{ name: SITE_CONFIG.name }],
    publisher: SITE_CONFIG.name,
  };
}
