"use client";

import {
  ArrowUpDown,
  DoorClosedLockedIcon,
  ThumbsUp,
  VoteIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { NomineesTableProps } from "./NomineesTable";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { GetIPResponse } from "@/types/vote";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchIPStatus } from "@/backend/lib/fetchApiStatus";
import Link from "next/link";
import { Button } from "../ui/button";

const NomineesList = ({
  nominees,
  loading,
  page,
  pagination,
  sortOrder,
  toggleSortOrder,
  setPage,
}: NomineesTableProps) => {
  const [votedNominee, setVotedNominee] = useState<string | null>(null);
  const [ip, setIp] = useState<string | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    fetch("/api/technical")
      .then((res) => res.json())
      .then((data) => {
        console.log("data ip", data);
        setIp(data.ip);
      });
  }, []);

  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  const handleVote = async (
    e: React.MouseEvent<HTMLButtonElement>,
    nomineeId: string,
  ) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/nominees/${nomineeId}/vote`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        await update();
        toast.success(`Congratulations!!! Your vote has been cast.`);
        //CRITICAL: Refetch the nominees data to get updated vote counts
        queryClient.invalidateQueries({ queryKey: ["nominees"] });
      } else {
        toast.error(data.message || "Update failed");
      }
      setVotedNominee(nomineeId);
      // Optionally: trigger re-fetch or optimistic UI update of votes
    } catch (error) {
      console.error("Error incrementing vote:", error);
    }
  };
  const { data, isLoading, isError, error } = useQuery<GetIPResponse>({
    queryKey: ["ipStatus"],
    queryFn: fetchIPStatus,
  });
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/*data?.youNominatedNominee && (
        <p className="text-slate-50/80">
          You nominated: {data.youNominatedNominee.name}{" "}
          {data.youNominatedNominee.surname}
        </p>
      )*/}
      {/*data?.youVotedNominee && (
        <p className="text-slate-50/80">
          You voted for: {data.youVotedNominee.name}{" "}
          {data.youVotedNominee.surname}
        </p>
      )*/}

      <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm p-6">
        List of All Nominees. Please vote any one of them.
      </h1>
      <button
        onClick={toggleSortOrder}
        className=" text-slate-50 flex items-center gap-2 text-lg transition cursor-pointer mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm"
      >
        <ArrowUpDown className="w-4 h-4 text-white" />
        {sortOrder === "desc" ? "Latest → Oldest" : "Oldest → Latest"}
      </button>

      {loading ? (
        <p>Loading nominees...</p>
      ) : (
        <div className="space-y-6 ">
          {nominees.map((n, index) => {
            const hasVoted =
              (userId && n.voters?.some((v) => v.userId === userId)) ||
              (!userId && ip && n.voters?.some((v) => v.ipAddress === ip)) ||
              votedNominee === n._id;
            return (
              <React.Fragment key={n._id}>
                {(index + 1) % 4 === 0 && (
                  <div
                    className="col-span-full text-slate-100 text-xl md:text-3xl w-full flex justify-center my-4"
                    key={`ad-${index}`}
                  >
                    <div className="ring-2 ring-slate-200 mx-2 p-6 w-full text-center bg-slate-800 rounded-lg">
                      🎯 Advertise your products
                    </div>
                  </div>
                )}
                <Link
                  href={`/nominees/${n._id}`}
                  key={n._id}
                  className="flex flex-col-reverse md:flex-row items-center md:items-stretch justify-between gap-6 border-2 p-4 rounded-xl shadow-md"
                >
                  {/* Info Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm p-6">
                    <p>
                      <strong>Name:</strong> {`${n.name} ${n.surname}`}
                    </p>

                    <p>
                      <strong>Party:</strong> {n.party}
                    </p>

                    <p>
                      <strong>Constituent Area:</strong> {n.address.ward}
                    </p>
                    <p>
                      <strong>Province:</strong> {n.province}
                    </p>
                    {/* Votes Ring */}
                    <div className="flex items-center gap-4 pt-4">
                      <div
                        className="
          relative flex items-center justify-center
          w-14 h-14 md:w-20 md:h-20
          rounded-full
          bg-black
          ring-4 ring-indigo-500/40
          shadow-[0_0_35px_rgba(99,102,241,0.9)]
          group-hover:shadow-[0_0_65px_rgba(168,85,247,1)]
          transition-all duration-300
        "
                      >
                        {/* Glow */}
                        <div
                          className="
          absolute inset-0 rounded-full
          bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500
          blur-xl opacity-40
        "
                        />

                        <span
                          className="
          relative text-4xl font-extrabold
          bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300
          bg-clip-text text-transparent
        "
                        >
                          {n.votes}
                        </span>
                      </div>

                      <span
                        className="
        uppercase tracking-widest text-xs font-bold
        bg-gradient-to-r from-indigo-400 to-pink-400
        bg-clip-text text-transparent
      "
                      >
                        Votes
                      </span>
                    </div>
                  </div>

                  {/* Vote Button in Center */}
                  <div className="flex flex-col justify-center items-center">
                    {hasVoted ? (
                      <>
                        <Button
                          disabled
                          className=" w-20 h-20 flex items-center justify-center rounded-full shadow-lg bg-green-500 text-white"
                        >
                          <ThumbsUp className="w-6 h-6" />
                        </Button>
                        <div className="flex items-center justify-center gap-2 ">
                          <span className="mt-2 text-sm font-medium text-green-600">
                            You Voted
                          </span>
                          {/* Remove or replace VoteIcon if not defined */}
                          <ThumbsUp className="w-6 h-6 text-sm font-medium text-green-600" />
                        </div>
                      </>
                    ) : !data?.youVotedNominee ? (
                      <>
                        <Button
                          onClick={(e) => handleVote(e, n._id)}
                          className="cursor-pointer rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                        >
                          <ThumbsUp className="w-14 h-14 text-xl" />
                        </Button>
                        <span className="cursor-pointer text-xl text-blue-600 font-medium">
                          Vote Now
                        </span>
                      </>
                    ) : (
                      <>
                        <Button
                          disabled
                          className="rounded-full w-20 h-20 bg-slate-400 text-white shadow-md"
                        >
                          <DoorClosedLockedIcon className="w-5 h-5" />
                        </Button>
                        <span className=" text-slate-500 font-medium">
                          Cannot Vote
                        </span>
                      </>
                    )}
                  </div>

                  {/* Image Section */}
                  {n.avatar?.url ? (
                    <Image
                      src={n.avatar?.url}
                      alt={`${n.name}${n.surname}`}
                      className="h-40 w-40 rounded-full object-cover border border-gray-300"
                      height={220}
                      width={220}
                    />
                  ) : (
                    <div className="w-40 h-40 md:w-60 md:h-60 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl border border-gray-300">
                      {n.name?.[0] || "?"}
                    </div>
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={!pagination.hasPrev}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${
                  page === p ? "bg-blue-500 text-white" : ""
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
            disabled={!pagination.hasNext}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NomineesList;
