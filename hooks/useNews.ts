// hooks/useNews.ts
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  author: string;
  publishedAt: string;
  source: string;
  content: string;
  image?: string | null;
  guid: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();
        setNews(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
          console.error("Error fetching news:", err);
        } else {
          const e = new Error(String(err));
          setError(e);
          console.error("Error fetching news (non-Error):", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return { news, loading, error };
}
