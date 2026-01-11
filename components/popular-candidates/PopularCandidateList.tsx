"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDeviceIdentifiers } from "@/app/hooks/useDeviceIdentifiers";
import toast from "react-hot-toast";
import Link from "next/link";
import { Crown } from "lucide-react";

interface Candidate {
  _id: string;
  name: string;
  surname: string;
  group: string;
  category?: string;
  party?: string;
  province: string;
  votes: number;
  avatar?: { url?: string };
}

export default function PopularCandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const { fingerprint } = useDeviceIdentifiers();

  // -----------------------------
  // Fetch candidates list
  // -----------------------------
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/popular-candidate/get-all");
        const data = await res.json();
        const sorted = (data.candidates || []).sort(
          (a: Candidate, b: Candidate) => b.votes - a.votes
        );
        setCandidates(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // -----------------------------
  // Vote function with confirmation prompt
  // -----------------------------
  const vote = async (id: string, name: string, surname: string) => {
    if (!fingerprint) return alert("Fingerprint not available");

    // *** ⬇️ Confirmation Prompt ***
    const confirmed = window.confirm(
      `Are you sure you want to vote for ${name} ${surname}? You can vote only once!`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/popular-candidate/${id}/vote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
      });

      const result = await res.json();

      if (res.ok) {
        // Re-fetch updated list
        const refreshed = await fetch("/api/popular-candidate/get-all");
        const newData = await refreshed.json();
        setCandidates(newData.candidates);

        toast.success("Your vote has been recorded");
      } else {
        toast.error(result.message || "Vote failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // -----------------------------
  // Loading states
  // -----------------------------
  if (loading)
    return (
      <p className="text-slate-50 text-sm py-4">Favourite Candidates...</p>
    );

  if (!candidates.length)
    return (
      <p className="text-slate-50 text-sm py-4">
        No fav. candidates available.
      </p>
    );

  // -----------------------------
  // Main UI
  // -----------------------------
  return (
    <div className="flex flex-col gap-4 text-slate-50 p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mt-6">
        Who would you like to see as the next Prime Minister of Nepal?
      </h1>

      <h1 className="text-2xl md:text-3xl text-center font-semibold text-red-700 mt-3 animate-pulse">
        Please, be precise to vote because voting is allowed only once!
      </h1>

      <div className="flex w-full flex-wrap gap-6 justify-center ">
        {candidates.map((c) => {
          const isPM =
            c.category && c.category.toLowerCase() === "prime minister";

          return (
            <div
              key={c._id}
              className={`w-full md:w-[calc(250px)] p-3 text-center text-sm md:text-lg rounded-2xl transition
                ${
                  isPM
                    ? "bg-gradient-to-br from-yellow-500/20 to-red-500/20 border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105"
                    : "border bg-white/10"
                }`}
            >
              {c.avatar?.url && (
                <Image
                  src={c.avatar.url}
                  alt={c.name}
                  height={80}
                  width={80}
                  className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full"
                />
              )}

              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                {c.name} {c.surname}
                {isPM && (
                  <Crown className="w-5 h-5 text-yellow-400 drop-shadow-md" />
                )}
              </h3>

              <div className="text-md">
                <p>{c.group === "party" ? c.party : "Independent"}</p>
                <p>{c.province}</p>
                <p>Votes: {c.votes}</p>
              </div>

              <button
                onClick={() => vote(c._id, c.name, c.surname)}
                className={`mt-2 ${
                  c.votes < 1 ? "bg-green-500 cursor-pointer" : "bg-red-600"
                } text-white px-3 py-1 rounded text-sm md:text-lg w-full`}
              >
                Vote
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
