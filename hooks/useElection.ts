"use client";
import { useState, useEffect, useMemo } from "react";
import { Party, VoteRecord, ElectionState } from "@/types/vote";

const INITIAL_PARTIES: Party[] = [
  { id: "1", name: "Nepali Congress", votes: 0, color: "#4f46e5" },
  { id: "2", name: "CPN-UML", votes: 0, color: "#dc2626" },
  { id: "3", name: "Maoist Centre", votes: 0, color: "#ea580c" },
  { id: "4", name: "Rastriya Swatantra Party", votes: 0, color: "#65a30d" },
  { id: "5", name: "Rastriya Prajatantra Party", votes: 0, color: "#0891b2" },
];

const INITIAL_STATE: ElectionState = {
  parties: INITIAL_PARTIES,
  votes: [],
  totalVotes: 0,
};

export const useElection = () => {
  const [election, setElection] = useState<ElectionState>(INITIAL_STATE);
  const [lastVoter, setLastVoter] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("election-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const loadedState: ElectionState = {
          parties: data.parties || INITIAL_PARTIES,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          votes: (data.votes || []).map((v: any) => ({
            ...v,
            timestamp: new Date(v.timestamp),
          })),
          totalVotes: data.totalVotes || 0,
        };
        setElection(loadedState);
        setLastVoter(data.lastVoter || null);
      } catch (error) {
        console.error("Failed to load election data:", error);
        setElection(INITIAL_STATE);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when election changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "election-data",
        JSON.stringify({
          ...election,
          lastVoter,
        })
      );
    }
  }, [election, lastVoter, isLoaded]);

  const vote = (voterId: string, partyId: string) => {
    if (election.votes.some((vote) => vote.voterId === voterId)) {
      throw new Error("You have already voted!");
    }

    const partyIndex = election.parties.findIndex((p) => p.id === partyId);
    if (partyIndex === -1) {
      throw new Error("Invalid party selected");
    }

    const newVote: VoteRecord = {
      voterId,
      partyId,
      timestamp: new Date(),
    };

    setElection((prev) => ({
      parties: prev.parties.map((party) =>
        party.id === partyId ? { ...party, votes: party.votes + 1 } : party
      ),
      votes: [...prev.votes, newVote],
      totalVotes: prev.totalVotes + 1,
    }));

    setLastVoter(voterId);
  };

  // FIX: Return the computed value directly, not a function
  const votedParties = useMemo(() => {
    return election.parties
      .map((party) => ({
        ...party,
        percentage:
          election.totalVotes > 0
            ? (party.votes / election.totalVotes) * 100
            : 0,
      }))
      .sort((a, b) => b.votes - a.votes);
  }, [election.parties, election.totalVotes]);

  const hasVoted = (voterId: string) => {
    return election.votes.some((vote) => vote.voterId === voterId);
  };

  return {
    election,
    lastVoter,
    vote,
    votedParties, // FIX: Return the computed value directly
    hasVoted,
    totalVotes: election.totalVotes,
    parties: election.parties,
    isLoaded,
  };
};
