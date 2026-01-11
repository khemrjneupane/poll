"use client";

import React from "react";
import { fetchIPStatus } from "@/backend/lib/fetchApiStatus";
import { GetIPResponse } from "@/types/vote";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Voted() {
  const { data, isLoading, isError, error } = useQuery<GetIPResponse>({
    queryKey: ["ipStatus"],
    queryFn: fetchIPStatus,
  });

  return (
    <motion.div
      className="w-full mx-auto space-y-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          // 💫 Loading
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/70 backdrop-blur-sm shadow-sm border-l-4 border-blue-500 rounded-xl p-4 flex items-center justify-center gap-3 text-blue-600 font-medium"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking your vote status...
          </motion.div>
        ) : isError ? (
          // ❌ Error
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md border-l-4 border-red-500 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2 text-red-600 font-semibold">
              <AlertCircle className="w-5 h-5" />
              Error Fetching Status
            </div>
            <p className="text-gray-700">
              {error instanceof Error
                ? error.message
                : "Something went wrong while fetching your voting status."}
            </p>
          </motion.div>
        ) : (
          // ✅ Voted or Not
          <motion.div
            key={data?.youVotedNominee ? "voted" : "not-voted"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            }}
            className={`shadow-md rounded-xl p-4 backdrop-blur-md transition-colors duration-500 ${
              data?.youVotedNominee
                ? "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500"
                : "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-300"
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-2 font-semibold ${
                data?.youVotedNominee ? "text-green-600" : "text-gray-600"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Voting Status
            </div>

            {data?.youVotedNominee ? (
              <motion.p
                key="voted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-gray-700 leading-relaxed"
              >
                🗳️ You have already voted{" "}
                <span className="font-semibold text-green-600">
                  {data.youVotedNominee.name.toUpperCase()}{" "}
                  {data.youVotedNominee.surname.toUpperCase()}
                </span>{" "}
                ({data.youVotedNominee.party}).
                <br />
                <span className="text-red-600 font-medium">
                  You cannot change your vote.
                </span>
              </motion.p>
            ) : (
              <motion.p
                key="not-voted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-gray-600 italic"
              >
                {data?.messageVoted ?? "You have not cast your vote yet."}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
