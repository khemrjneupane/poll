"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface Notice {
  id: number;
  name: string;
  value: string;
  created_at: string;
}

export default function ElectionNotices() {
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [visibleNotices, setVisibleNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 8;
  const minVisible = 5;
  const [loading, setLoading] = useState(true);

  // Compute 1 year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const fetchAllNotices = async () => {
    setLoading(true);
    try {
      let page = 1;
      let tempNotices: Notice[] = [];
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `https://election.gov.np/admin/public/api/resources/notice?lang=np&page=${page}`
        );
        const data = await res.json();

        // Filter only last 1 year
        const recent = data.data.filter(
          (notice: Notice) => new Date(notice.created_at) >= oneYearAgo
        );

        tempNotices = [...tempNotices, ...recent];

        if (page >= data.meta.last_page - 20) {
          hasMore = false;
        } else {
          page++;
        }
      }

      setAllNotices(tempNotices);

      // Compute total pages
      const computedTotalPages = Math.ceil(
        Math.max(tempNotices.length, minVisible) / perPage
      );
      setTotalPages(computedTotalPages);

      // Show initial notices
      setVisibleNotices(tempNotices.slice(0, perPage));
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);
  // Update visible notices on page change (for mobile)
  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    setVisibleNotices(allNotices.slice(start, end));
  }, [currentPage, allNotices]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading && visibleNotices.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-10 text-gray-300">
        Loading notices…
      </div>
    );
  }

  return (
    <aside className="max-w-7xl mx-auto space-y-6 px-6 py-2 xl:w-[340px] flex flex-col xl:mt-4 xl:px-0 mb-16 xl:mb-0">
      {/* Header */}
      <h2 className=" bg-blue-600 text-white flex  gap-2 items-center justify-center p-3 text-lg font-semibold rounded-md">
        {/* Logo */}
        <Image
          src="https://election.gov.np/static/media/logo-1.56a73d1a.png"
          alt="Election Logo"
          width={124}
          height={124}
          className="rounded-full"
        />
        निर्वाचन आयोग सूचनाहरू
      </h2>

      {/* Desktop Load More */}
      <div className="z-99 hidden xl:flex justify-center">
        {visibleNotices.length < allNotices.length &&
          currentPage >= totalPages && (
            <button
              onClick={handlePrev}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Load Prev
            </button>
          )}
        {visibleNotices.length < allNotices.length &&
          currentPage !== totalPages && (
            <button
              onClick={handleNext}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Load Next
            </button>
          )}
      </div>
      {/* Notice Cards */}
      <div className="flex flex-wrap xl:flex-col gap-4 justify-center xl:justify-start">
        {visibleNotices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="flex-1 min-w-[280px] xl:min-w-0"
          >
            <Link
              href={notice.value}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-md hover:shadow-xl hover:border-blue-500 transition-all duration-300">
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-700">
                    {notice.value.endsWith(".pdf") ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-300 text-xs font-medium">
                        PDF
                      </div>
                    ) : (
                      <Image
                        src={notice.value}
                        alt={notice.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>

                  <div className="flex flex-col text-gray-200">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-3 hover:text-blue-400 transition-colors">
                      {notice.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notice.created_at).toLocaleDateString("ne-NP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      {/* Mobile Pagination */}
      <div className="flex xl:hidden justify-between mt-4 mb-11">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Prev
        </button>
        <span className="text-gray-300 flex items-center">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>
    </aside>
  );
}
