"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { GetIPResponse } from "@/types/vote";
import { fetchIPStatus } from "@/backend/lib/fetchApiStatus";

const CandidateCard = ({
  title,
  candidate,
}: {
  title: string;
  candidate: {
    name?: string;
    surname?: string;
    age?: number;
    party?: string;
    group?: string;
    province?: string;
    votes?: number;
    avatar?: {
      url?: string;
    };
  };
}) => (
  <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 border-2 p-6 rounded-xl shadow-md bg-white">
    {/* Info Section */}
    <div className="flex-1 space-y-1">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>
        <strong>Name:</strong> {`${candidate?.name} ${candidate?.surname}`}
      </p>
      <p>
        <strong>Age:</strong> {candidate?.age}
      </p>
      <p>
        <strong>Party:</strong> {candidate?.party}
      </p>
      <p>
        <strong>Group:</strong> {candidate?.group}
      </p>
      <p>
        <strong>Province:</strong> {candidate?.province}
      </p>
      <p>
        <strong>Votes:</strong> {candidate?.votes}
      </p>
    </div>

    {/* Image Section */}
    {candidate?.avatar?.url ? (
      <Image
        src={candidate.avatar.url}
        alt={`${candidate.name} ${candidate.surname}`}
        className="h-40 w-40 md:h-60 md:w-60 rounded-full object-cover border border-gray-300"
        height={220}
        width={220}
      />
    ) : (
      <div className="w-40 h-40 md:w-60 md:h-60 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl border border-gray-300">
        {candidate?.name?.[0] || "?"}
      </div>
    )}
  </div>
);

const NominatedVoted = () => {
  const { data: session } = useSession();

  const { data, isLoading, isError } = useQuery<GetIPResponse>({
    queryKey: ["ipStatus", session?.user?.id],
    queryFn: fetchIPStatus,
    enabled: !!session, // only fetch if logged in
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center">
        Failed to load your nomination/vote status.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 text-slate-900/80">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Your Nomination & Vote Status
      </h2>

      <div className="space-y-6">
        {data?.votedObject ? (
          <CandidateCard
            title={`You have Voted for ${data.votedObject?.name}-${data.votedObject?.surname}`}
            candidate={data.votedObject}
          />
        ) : (
          <p className="text-gray-600 text-center">
            You have not voted for any candidate yet.
          </p>
        )}
        {data?.nominatedObject ? (
          <CandidateCard
            title={`You have Nominated for ${data.nominatedObject?.name}-${data.nominatedObject?.surname}`}
            candidate={data.nominatedObject}
          />
        ) : (
          <p className="text-gray-600 text-center">
            You have not nominated any candidate yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default NominatedVoted;
