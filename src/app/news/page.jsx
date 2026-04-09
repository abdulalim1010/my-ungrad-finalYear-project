"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Eye, ArrowRight, Newspaper, Sparkles } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const showMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleNews = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
            <Newspaper className="text-white" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Department News & Events
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Stay updated with the latest academic updates, seminars, research activities and events
            from the Department of Electrical & Electronic Engineering.
          </p>
        </motion.div>

        {/* NEWS GRID */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600">No news available at the moment</p>
            <p className="text-gray-500 mt-2">Check back later for updates</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleNews.map((item, index) => (
              <motion.article
                key={item._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="text-gray-400" size={64} />
                    </div>
                  )}

                  {/* CATEGORY BADGE */}
                  {item.category && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg"
                    >
                      {item.category}
                    </motion.span>
                  )}

                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h2>

                  {/* META INFO */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye size={16} />
                      <span>{item.views || 0}</span>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <Link
                    href={`/news/${item.slug}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                    px-6 py-3 text-sm font-semibold text-white 
                    hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                  >
                    <span>Read Full News</span>
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={showMore}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Read More
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
}
