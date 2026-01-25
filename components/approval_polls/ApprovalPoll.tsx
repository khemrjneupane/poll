"use client";

import { useEffect, useState } from "react";
import { useDeviceIdentifiers } from "@/app/hooks/useDeviceIdentifiers";
import toast from "react-hot-toast";
import Image from "next/image";

interface Voter {
  userId?: string;
  fingerprint: string;
  choice: "yes" | "no" | "undecided";
  votedAt: string;
}

interface ApprovalPoll {
  _id: string;
  title: string;
  yes: number;
  no: number;
  voters: Voter[];
  avatar?: {
    public_id: string;
    url: string;
  };
}

export default function ApprovalPollComponent() {
  const [poll, setPoll] = useState<ApprovalPoll | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { fingerprint } = useDeviceIdentifiers();

  const fetchPoll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/approval");
      const data = await res.json();
      if (res.ok) setPoll(data.poll);
      else toast.error(data.message || "Failed to fetch poll");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch poll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  const totalVotes = poll ? poll.yes + poll.no : 0;

  const percent = (count: number) =>
    totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : "0";

  const vote = async (choice: "yes" | "no" | "undecided") => {
    if (!fingerprint) return toast.error("Fingerprint not available");

    setSubmitting(true);
    try {
      const res = await fetch("/api/approval/vote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      const data = await res.json();
      if (res.ok) {
        setPoll(data.poll);
        toast.success("Vote submitted successfully!");
      } else {
        toast.error(data.message || "Vote failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className="text-white text-center py-4">Loading PM approval poll...</p>
    );
  if (!poll)
    return <p className="text-white text-center py-4">No active poll.</p>;

  return (
    <div className="w-full flex flex-col bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 text-white  mx-auto mt-6 shadow-xl">
      {/* ---------- PM IMAGE AT TOP ---------- */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm ">
        {poll.title}
      </h1>
      {poll.avatar?.url && (
        <div>
          <div className="flex flex-col items-start">
            <div className="flex items-center justify-between w-full gap-6">
              <Image
                src={poll.avatar.url}
                alt="PM Avatar"
                height={80}
                width={80}
                className="
                h-18
                w-18
              md:w-32 md:h-32 
              rounded-full 
              object-cover 
              border-4 border-gray-700 
              shadow-lg shadow-black/40
            "
              />
              {/* Votes Bars */}
              <div className="w-full space-y-2">
                <div className="flex justify-center items-center gap-6">
                  <button
                    disabled={submitting}
                    onClick={() => vote("yes")}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    Like
                  </button>
                  <div className="w-full bg-gray-700 rounded-full  overflow-hidden">
                    <div
                      className="bg-green-500 h-4 transition-all"
                      style={{ width: `${percent(poll.yes)}%` }}
                    />
                  </div>
                  <div>{percent(poll.yes)}%</div>
                </div>
                {/* Dont like */}
                <div className="flex justify-center items-center gap-6">
                  <button
                    disabled={submitting}
                    onClick={() => vote("no")}
                    className="whitespace-nowrap bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold  disabled:opacity-50 cursor-pointer"
                  >
                    <span>Don&apos;t Like</span>
                  </button>
                  <div className="w-full bg-gray-700 rounded-full  overflow-hidden">
                    <div
                      className="bg-red-500 h-4 transition-all"
                      style={{ width: `${percent(poll.no)}%` }}
                    />
                  </div>
                  <div>{percent(poll.no)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
