"use client";
import { useNomineeById } from "@/app/hooks/useNomineeById";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Home, Vote, Calendar, MapPin, Users } from "lucide-react";

export default function AnomineeById() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const { data: n, isLoading, error } = useNomineeById(id);

  if (error) {
    toast.error(`${error.message}`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-red-500 text-lg">Error loading nominee</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!n) {
    toast.error("Nominee not found");
    return null;
  }

  return (
    <div className="min-h-screen py-26 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Home Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/")}
              className="cursor-pointer fixed top-6 left-6 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <Home className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </motion.button>
            {/* Profile Header */}
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-40 h-40 relative rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-6 shadow-2xl border-4 border-white"
              >
                {n.avatar?.url ? (
                  <Image
                    src={n.avatar.url}
                    alt={`${n.name} ${n.surname}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-bold bg-gradient-to-br from-slate-100 to-slate-200">
                    {n.name?.[0] || "?"}
                  </div>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                {n.name} {n.surname}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-lg text-slate-600 mb-4"
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">{n.party}</span>
                <span className="text-slate-300">•</span>
                <span>{n.group}</span>
              </motion.div>
            </div>

            {/* Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Province</p>
                  <p className="font-semibold text-slate-800">{n.province}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-500">Nominated</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(n.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Votes Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <Vote className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/80 text-sm">Total Votes</p>
                  <p className="text-white text-2xl font-bold">
                    {n.votes?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Back Button for Mobile */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/")}
          className="mt-6 w-full py-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center gap-2 md:hidden"
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold text-slate-700">Back to Home</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
