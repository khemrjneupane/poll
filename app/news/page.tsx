import { generateMetadatas } from "@/backend/lib/metadata";
import RssNews from "@/components/news/rss_news/RssNews";
import React from "react";

export const metadata = generateMetadatas({
  title: "Election News",
  description:
    "Stay updated with latest election news, political developments, candidate updates, and important announcements about Nepal's democratic processes.",
  path: "/news",
  ogImage: "/assets/og-image.png",
  type: "website",
  keywords: [
    "election news Nepal",
    "political news",
    "election updates",
    "Nepal politics",
    "candidate news",
    "election announcements",
    "political developments",
    "democracy news Nepal",
  ],
});
const page = () => {
  return <RssNews />;
};

export default page;
