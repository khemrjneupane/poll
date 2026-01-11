"use client";

import { useNews } from "@/hooks/useNews";
import Link from "next/link";

export default function BreakingNewsTicker() {
  const { news, loading, error } = useNews();

  // Shared wrapper style
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="z-50 relative mt-24 text-white overflow-hidden ring-2 border-red-700 flex items-center mx-auto justify-between px-4 md:px-6 gap-2 h-12 bg-red-900">
      {children}
    </div>
  );

  if (loading) {
    return (
      <Wrapper>
        <div className="px-4 py-2 bg-red-800 font-semibold">Breaking News</div>
        <p className="text-sm opacity-80 animate-pulse">Loading news...</p>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="px-4 py-2 bg-red-800 font-semibold">Breaking News</div>
        <p className="text-sm text-yellow-300">⚠️ Error loading news</p>
      </Wrapper>
    );
  }

  const ICONS = ["🗳️", "📊", "🚨", "📅", "🕊️", "📰", "🌍", "⚡", "🔥", "⭐"];

  const createHeadlinesFromNews = (news: { title: string }[]) =>
    news.map((item) => {
      const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
      return `${randomIcon} ${item.title}`;
    });

  const newsHeadlines = createHeadlinesFromNews(news);

  return (
    <div className="z-50 relative mt-24 text-white overflow-hidden ring-2 border-red-700 flex items-center mx-auto justify-between px-4 md:px-6 gap-2 h-12">
      {/* Label */}
      <div className="px-4 py-2 bg-red-800 font-semibold z-20">
        Breaking News
      </div>

      {/* Marquee */}
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 from-red-600 to-transparent z-10" />

        <div className="flex whitespace-nowrap animate-marquee">
          {newsHeadlines.map((headline, i) => (
            <Link href="/news" key={`b-${i}`} className="mx-4">
              {headline}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
