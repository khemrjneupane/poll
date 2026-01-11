"use client";

import { useNews } from "@/hooks/useNews";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
/*
interface NewsItem {
  title: string;
  link: string;
  author: string;
  publishedAt: string;
  source: string;
  content: string;
  image?: string | null;
  guid: string;
}*/

export default function RssNews() {
  // const [news, setNews] = useState<NewsItem[]>([]);
  //const [loading, setLoading] = useState(true);
  const { news, loading, error } = useNews();
  /*
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);
*/
  // Function to extract plain text from HTML content
  const extractTextFromHTML = (html: string) => {
    if (typeof window !== "undefined") {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    }
    // Fallback for server-side: remove HTML tags
    return html.replace(/<[^>]*>/g, "");
  };

  // Function to get a clean image URL
  const getCleanImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    // Remove size parameters from WordPress images if needed
    return url.replace(/-\\d+x\\d+\\.(jpg|jpeg|png)/i, ".$1");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading latest election news...
        </div>
      </div>
    );

  if (!news.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No election news found right now.
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🗳️ Nepal Election 2025 — Latest News
      </h1>
      <div className="flex flex-col gap-6">
        {news.map((item) => {
          const cleanContent = extractTextFromHTML(item.content);
          const imageUrl = getCleanImageUrl(item.image);
          const hasImage = imageUrl && !imageUrl.includes("addtoany.com");

          return (
            <Link
              key={item.guid}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <article
                key={item.guid}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                <div
                  className={`p-6 ${
                    hasImage ? "flex flex-col md:flex-row gap-6" : ""
                  }`}
                >
                  {/* Image Section */}
                  {hasImage && (
                    <div className="md:w-1/3 flex-shrink-0">
                      <div className="relative h-48 md:h-40 w-full rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onError={(e) => {
                            // Hide image on error
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className={`flex-1 ${hasImage ? "md:w-2/3" : ""}`}>
                    <h2 className="text-xl font-bold mb-3 hover:text-blue-600 line-clamp-2 leading-tight">
                      {item.title}
                    </h2>

                    {/* Content Preview */}
                    <div className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                      {cleanContent || "No content available..."}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="font-medium">
                          {item.source.replace(".com", "")}
                        </span>
                      </div>

                      {item.author && item.author !== item.source && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">✍️</span>
                          <span>{item.author}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">📅</span>
                        <span>
                          {new Date(item.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-blue-600 font-medium hover:text-blue-700">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
